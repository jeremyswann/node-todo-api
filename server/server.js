const express = require('express')
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoos')
const { Todo } = require('./models/todo')
const { User } = require('./models/user')

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

// app.get(('/todos', (req,res) => {

// })

// app.update(('/todos', id, (req,res) => {

// })

app.listen(3000, () => console.log('Started server on port 3000'))
