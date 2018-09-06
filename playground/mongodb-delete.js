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

		// * deleteMany
		// db.collection('Todos')
		// 	.deleteMany({
		// 		text: 'eat lunch',
		// 	})
		// 	.then(res => console.log(res))

		// * deleteOne
		// db.collection('Todos')
		// 	.deleteOne({
		// 		text: 'eat lunch',
		// 	})
		// 	.then(res => console.log(res))

		// * findOneAndDelete
		// db.collection('Todos')
		// 	.findOneAndDelete({
		// 		completed: false,
		// 	})
		// 	.then(res => console.log(res))

		// * findOneAndDelete User by ID
		db.collection('Users')
			.findOneAndDelete({
				_id: new ObjectID('5b909291fd8a7710ec7ef599'),
			})
			.then(res => console.log(JSON.stringify(res, undefined, 2)))

		client.close()
	}
)
