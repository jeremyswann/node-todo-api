const request = require('supertest')

const { app } = require('./../../app')
const { Todo } = require('./../models/todo')

describe('POST /todos', () => {
	beforeEach(done => {
		Todo.deleteMany({}).then(() => done())
	})
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
						expect(todos.length).toEqual(1)
						expect(todos[0].text).toEqual(text)
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
						expect(todos.length).toBe(0)
						done()
					})
					.catch(err => done(err))
			})
	})
	afterAll(done => {
		Todo.disconnect({}).then(() => done())
	})
})
