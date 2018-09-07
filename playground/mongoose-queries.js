const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoos')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

const id = '5b921577bc961607b83e184f'

if (!ObjectID.isValid(id)) {
	console.log('ID not valid')
}

// Todo.find({
// 	_id: id,
// }).then(todos => {
// 	if (!todos) {
// 		return console.log('ID not found')
// 	}
// 	console.log('Todos', todos)
// })

// Todo.findOne({
// 	_id: id,
// }).then(todo => {
// 	if (!todo) {
// 		return console.log('ID not found')
// 	}
// 	console.log('Todo', todo)
// })

// Todo.findById(id)
// 	.then(todo => {
// 		if (!todo) {
// 			return console.log('ID not found')
// 		}
// 		console.log('Todo by ID', todo)
// 	})
// 	.catch(err => console.log(err))

User.findById('5b90b06a67ea2d29044a3336').then(
	user => {
		if (!user) {
			return console.log('User does not exist')
		}
		console.log(JSON.stringify(user, undefined, 2))
	},
	err => console.log(err)
)
