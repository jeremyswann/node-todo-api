require('./server/config')

// * PACKAGES
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// * DATABASE
const { mongoose } = require('./server/db/mongoose')

// * MODELS
const { Todo } = require('./server/models/todo')
const { User } = require('./server/models/user')

// * MIDDLEWARE
const { authenticate } = require('./server/middleware/authenticate')

// * DEFINE APP
const app = express()

app.use(bodyParser.json())

// * POST /todos
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

// * GET /todos
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

	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

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

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user)
})

module.exports = { app }
