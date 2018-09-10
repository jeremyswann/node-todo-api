const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../../app')
const { Todo } = require('./../models/todo')

const todos = [
	{
		_id: new ObjectID(),
		text: 'First todo',
	},
	{
		_id: new ObjectID(),
		text: 'Second todo',
	},
]

beforeEach(done => {
	Todo.deleteMany({})
		.then(() => {
			return Todo.insertMany(todos)
		})
		.then(() => done())
})

describe('POST /todos', () => {
	test('Should create a new todo', done => {
		const text = 'Test todo text'
		return request(app)
			.post('/todos')
			.send({ text })
			.expect(200)
			.expect(res => {
				expect(res.body.text).toEqual(text)
			})
			.end((err, res) => {
				if (err) {
					return done(err)
				}

				Todo.find()
					.then(todos => {
						expect(todos.length).toEqual(3)
						expect(todos[2].text).toEqual(text)
						done()
					})
					.catch(err => done(err))
			})
	})
	test('Should not create todo with invalid body data', done => {
		return request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err)
				}

				Todo.find()
					.then(todos => {
						expect(todos.length).toEqual(2)
						done()
					})
					.catch(err => done(err))
			})
	})
})

describe('GET /todos', () => {
	test('Should get all todos', done => {
		return request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toEqual(2)
			})
			.end(done)
	})
})

describe('GET /todos/:id', () => {
	test('Should return todo doc', done => {
		// console.log(`/todos/${todos[0]._id.toHexString()}`)
		return request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toEqual(todos[0].text)
			})
			.end(done)
	})
	test('Should return 404 if not found', done => {
		const hexID = new ObjectID().toHexString()
		return request(app)
			.get(`/todos/${hexID}`)
			.expect(404)
			.end(done)
	})
	test('Should return 404 for non-object ids', done => {
		return request(app)
			.get(`/todos/123abc`)
			.expect(404)
			.end(done)
	})
})

afterAll(done => {
	done()
})
