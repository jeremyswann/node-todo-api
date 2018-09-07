const request = require('supertest')

const { app } = require('./../../app')
const { Todo } = require('./../models/todo')

const todos = [
	{
		text: 'First todo',
	},
	{
		text: 'Second todo',
	},
]

describe('POST /todos', () => {
	beforeEach(done => {
		Todo.deleteMany({})
			.then(() => {
				return Todo.insertMany(todos)
			})
			.then(() => done())
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
	afterAll(done => {
		Todo.disconnect({}).then(() => done())
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
