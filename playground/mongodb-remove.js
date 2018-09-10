const { ObjectID } = require('mongodb')

const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

Todo.remove({}).then(res => console.log(res))

Todo.findOneAndRemove({ _id: '5b95ec1fa5ad7c778c64d843' }).then(todo =>
	console.log(todo)
)

Todo.findByIdAndRemove('5b95ec1fa5ad7c778c64d843').then(todo =>
	console.log(todo)
)
