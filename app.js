const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./server/db/mongoos')
const { Todo } = require('./server/models/todo')
const { User } = require('./server/models/user')

const app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
	const todo = new Todo({
		text: req.body.text,
	})
	todo.save().then(
		doc => {
			res.send(doc)
		},
		err => {
			res.status(400).send(err)
		}
	)
})

app.get('/todos', (req, res) => {
	Todo.find().then(
		todos => {
			res.send({ todos })
		},
		err => {
			res.status(400).send(err)
		}
	)
})

// app.update(('/todos', id, (req,res) => {

// })

module.exports = { app }
