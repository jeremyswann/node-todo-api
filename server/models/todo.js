const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	text: { type: String, required: true, minlength: 1, trim: true },
	completed: { type: Boolean, default: false },
	completedAt: { type: Number, default: null },
})
const Todo = mongoose.model('Todo', schema)

module.exports = { Todo }
