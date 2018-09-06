const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect(
	'mongodb://localhost:27017/TodoApp',
	{ useNewUrlParser: true },
	(err, client) => {
		if (err) {
			return console.log('Unable to connect to MongoDB server')
		}
		console.log('Connected to MongoDB server')
		const db = client.db('TodoApp')

		// * findOneAndUpdate
		db.collection('Todos')
			.findOneAndUpdate(
				{ _id: new ObjectID('5b909befda403d3a3007fae5') },
				{ $set: { completed: true } },
				{ returnOriginal: false }
			)
			.then(res => console.log(res))

		// * findOneAndUpdate by ID $inc User age by 1
		db.collection('Users')
			.findOneAndUpdate(
				{ _id: new ObjectID('5b908c930758b710a4eac652') },
				{ $inc: { age: +1 } },
				{ returnOriginal: false }
			)
			.then(res => console.log(res))

		client.close()
	}
)
