/* global beforeEach, it, expect, describe */
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../../app')
const { Todo } = require('./../models/todo')
const { User } = require('./../models/user')
const { todos, users, populateTodos, populateUsers } = require('./seeds/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
	it('Should create a new todo', done => {
		const text = 'Test todo text'
		request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toEqual(text)
			})
			.end(e => {
				if (e) {
					return done(e)
				}
				Todo.find()
					.then(todos => {
						expect(todos.length).toEqual(3)
						expect(todos[2].text).toEqual(text)
						done()
					})
					.catch(e => done(e))
			})
	})
	it('Should not create todo with invalid body data', done => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end(e => {
				if (e) {
					return done(e)
				}
				Todo.find()
					.then(todos => {
						expect(todos.length).toEqual(2)
						done()
					})
					.catch(e => done(e))
			})
	})
})

describe('GET /todos', () => {
	it('Should get all todos', done => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toEqual(2)
			})
			.end(done)
	})
})

describe('GET /todos/:id', () => {
	it('Should return todo doc', done => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toEqual(todos[0].text)
			})
			.end(done)
	})
	it('Should return 404 if not found', done => {
		const hexID = new ObjectID().toHexString()
		request(app)
			.get(`/todos/${hexID}`)
			.expect(404)
			.end(done)
	})
	it('Should return 404 for non-object ids', done => {
		request(app)
			.get(`/todos/123abc`)
			.expect(404)
			.end(done)
	})
})

describe('DELETE /todos/:id', () => {
	it('Should remove a todo doc', done => {
		const hexID = todos[1]._id.toHexString()
		request(app)
			.delete(`/todos/${hexID}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toEqual(hexID)
			})
			.end(e => {
				if (e) {
					return done(e)
				}
				Todo.findById(hexID)
					.then(todo => {
						expect(todo).toBeFalsy()
						done()
					})
					.catch(e => done(e))
			})
	})
	it('Should return 404 if not found', done => {
		const hexID = new ObjectID().toHexString()
		request(app)
			.delete(`/todos/${hexID}`)
			.expect(404)
			.end(done)
	})
	it('Should return 404 for non-object ids', done => {
		request(app)
			.delete(`/todos/123abc`)
			.expect(404)
			.end(done)
	})
})

describe('UPDATE /todos/:id', () => {
	it('Should remove a todo doc', done => {
		const hexID = todos[0]._id.toHexString()
		request(app)
			.patch(`/todos/${hexID}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toEqual(hexID)
			})
			.end(e => {
				if (e) {
					return done(e)
				}

				Todo.findById(hexID)
					.then(todo => {
						expect(todo).toBeTruthy()
						done()
					})
					.catch(e => done(e))
			})
	})
	it('Should return 404 if not found', done => {
		const hexID = new ObjectID().toHexString()
		request(app)
			.patch(`/todos/${hexID}`)
			.expect(404)
			.end(done)
	})
	it('Should return 404 for non-object ids', done => {
		request(app)
			.patch(`/todos/123abc`)
			.expect(404)
			.end(done)
	})
})

describe('GET /users/me', () => {
	it('Should return user if authenticated', done => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[1]._id.toHexString())
				expect(res.body.email).toBe(users[1].email)
			})
			.end(done)
	})
	it('Should return 401 if not authenticated', done => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({})
			})
			.end(done)
	})
})

describe('POST /users', () => {
	it('Should create a user', done => {
		const email = 'jswanderulo@example.com'
		const password = '24f8tf22'
		request(app)
			.post('/users')
			.send({ email, password })
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toBeTruthy()
				expect(res.body._id).toBeTruthy()
				expect(res.body.email).toBe(email)
			})
			.end(e => {
				if (e) {
					return done(e)
				}
				User.findOne({ email }).then(user => {
					expect(user).toBeTruthy()
					expect(user.password).not.toBe(password)
					done()
				})
			})
	})
	it('Should return validation errors if request invalid', done => {
		request(app)
			.post('/users')
			.send({
				email: 'and',
				password: '123',
			})
			.expect(400)
			.end(done)
	})
	it('Should not create user if email in use', done => {
		request(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: 'Password123',
			})
			.expect(400)
			.end(done)
	})
})
