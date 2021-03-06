const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 5,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{VALUE} is not a valid email address`,
		},
	},
	password: { type: String, required: true, minlength: 8 },
	tokens: [
		{
			access: {
				type: String,
				required: true,
			},
			token: {
				type: String,
				required: true,
			},
		},
	],
})

// * Instance (user) Methods === methods
schema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()
	return _.pick(userObject, ['_id', 'email'])
}
schema.methods.generateAuthToken = function() {
	const user = this
	const access = 'auth'
	const token = jwt
		.sign({ _id: user._id.toHexString(), access }, 'abc123!')
		.toString()
	user.tokens = user.tokens.concat([{ access, token }])
	return user.save().then(() => {
		return token
	})
}

// * Model (User) Methods === statics
schema.statics.findByToken = function(token) {
	const User = this
	let decoded

	try {
		decoded = jwt.verify(token, 'abc123!')
	} catch (e) {
		return Promise.reject()
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth',
	})
}

schema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

const User = mongoose.model('User', schema)

module.exports = { User }
