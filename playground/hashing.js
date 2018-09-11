// const { SHA256 } = require('crypto-js')
// const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const pass = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(pass, salt, (err, hash) => {
		console.log('Hash: ', hash)
		bcrypt.compare('123abc!', hash, (err, res) => {
			console.log('Pass is: ', res)
		})
	})
})

// * Javascript Web Tokens
// const data = {
// 	id: 10,
// }

// const token = jwt.sign(data, 'password!')
// console.log('Encoded: ', token)
// const decode = jwt.verify(token, 'password!')
// console.log('Decoded: ', decode)

// * Hash and Salt
// const msg = `I am user no. 3`
// const hash = SHA256(msg).toString()

// console.log(`Message: ${msg}`)
// console.log(`Hash: ${hash}`)

// const data = {
// 	id: 4,
// }
// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'salt').toString(),
// }

// * Man in the middle attack
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// const resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString()
// if (resultHash === token.hash) {
// 	console.log('Data was not changed')
// } else {
// 	console.log('Data was changed. Do not trust!')
// }
