// const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')

const data = {
	id: 10,
}

const token = jwt.sign(data, 'Swan503eb!')
console.log('Encoded: ', token)
const decode = jwt.verify(token, 'Swan503eb!')
console.log('Decoded: ', decode)

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
