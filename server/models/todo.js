const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	text: { type: String, required: true, minlength: 1, trim: true },
	completed: { type: Boolean, default: false },
	completedAt: { type: Number, default: null },
})
const Todo = mongoose.model('Todo', schema)

// const newTodo = new Todo({
// 	text: 'Cook dinner',
// })

// newTodo.save().then(
// 	doc => {
// 		console.log('Saved Todo', JSON.stringify(doc, undefined, 2))
// 	},
// 	err => {
// 		console.log('Unable to save Todo', JSON.stringify(err, undefined, 2))
// 	}
// )

module.exports = { Todo }
