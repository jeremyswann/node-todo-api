require('./server/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

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

// *
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

// * GET /todos by ID
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

// * UPDATE /todos by ID
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

// * DELETE /todos by ID
app.delete('/todos/:id', (req, res) => {
	const id = req.params.id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}
	Todo.findByIdAndRemove(id)
		.then(todo => {
			if (!todo) {
				return res.status(404).send()
			}
			res.status(200).send({ todo })
		})
		.catch(e => res.status(404).send(e))
})

// * POST /users
app.post('/users', (req, res) => {
	const body = _.pick(req.body, ['email', 'password'])
	const user = new User(body)

	user
		.save()
		.then(() => {
			return user.generateAuthToken()
		})
		.then(token => {
			res.header('x-auth', token).send(user)
		})
		.catch(e => res.status(400).send(e))
})

module.exports = { app }
