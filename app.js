const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./server/db/mongoose')
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
// GET /todos/123456
app.get('/todos/:id', (req, res) => {
	const id = req.params.id

	// Validate id using isValid
	// 404 - send back empty send
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// findById
	Todo.findById(id)
		.then(todo => {
			if (!todo) {
				return res.status(404).send()
			}
			res.status(200).send({ todo })
		})
		.catch(e => console.log(e))
})

// app.update(('/todos', id, (req,res) => {

// })

module.exports = { app }
