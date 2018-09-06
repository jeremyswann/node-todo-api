const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	name: { type: String, required: true, minlength: 1, trim: true },
	email: { type: String, required: true, minlength: 5, trim: true },
	password: { type: String, required: true, minlength: 8, trim: true },
})
const User = mongoose.model('User', schema)

// const newUser = new User({
// 	name: 'Jeremy',
// 	email: 'jeremy.swanborough@maytronics.com',
// 	password: 'Swan503eb!',
// })

// newUser.save().then(
// 	doc => {
// 		console.log('Saved Todo', JSON.stringify(doc, undefined, 2))
// 	},
// 	err => {
// 		console.log('Unable to save Todo', JSON.stringify(err, undefined, 2))
// 	}
// )

module.exports = { User }
