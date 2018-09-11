const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('./../../models/todo')
const { User } = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [
	{
		_id: userOneId,
		email: 'first@user.com',
		password: 'userOnePass',
	},
	{
		_id: userTwoId,
		email: 'second@user.com',
		password: 'userTwoPass',
		tokens: [
			{
				access: 'auth',
				token: jwt
					.sign({ _id: userTwoId, access: 'auth' }, 'abc123!')
					.toString(),
			},
		],
	},
]

const todos = [
	{
		_id: new ObjectID(),
		text: 'First test todo',
	},
	{
		_id: new ObjectID(),
		text: 'Second test todo',
		completed: true,
		completedAt: 333,
	},
]

const populateTodos = done => {
	Todo.deleteMany({})
		.then(() => {
			return Todo.insertMany(todos)
		})
		.then(() => done())
}

const populateUsers = done => {
	User.deleteMany({})
		.then(() => {
			const userOne = new User(users[0]).save()
			const userTwo = new User(users[1]).save()
			return Promise.all([userOne, userTwo])
		})
		.then(() => done())
}

module.exports = { todos, users, populateTodos, populateUsers }
