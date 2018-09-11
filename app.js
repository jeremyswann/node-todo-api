require('./server/config')
const _ = require('lodash')
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

// GET /todos/:ID
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
		.catch(e => res.status(404).send(e))
})

// UPDATE /todos/:ID
app.patch('/todos/:id', (req, res) => {
	const id = req.params.id
	const body = _.pick(req.body, ['text', 'completed'])

	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime()
	} else {
		body.completed = false
		body.completedAt = null
	}

	Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
		.then(todo => {
			if (!todo) {
				return res.status(404).send()
			}
			res.status(200).send({ todo })
		})
		.catch(e => res.status(404).send(e))
})

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id

	// Validate id using isValid
	// 404 - send back empty send
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// findById
	Todo.findByIdAndRemove(id)
		.then(todo => {
			if (!todo) {
				return res.status(404).send()
			}
			res.status(200).send({ todo })
		})
		.catch(e => res.status(404).send(e))
})

module.exports = { app }
