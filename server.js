console.log('May Node be with you');
const express = require("express");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

var db;
MongoClient.connect('mongodb://richm:RO10rxEUvRlz7K3N@ds261247.mlab.com:61247/my-quotes-app', (err, database) => {
	if (err) return console.log(err);
	db = database;
	// myDb.collection('quotes');
	// ... start the server
	app.listen(3000, () =>{
		// console.log(db);
		console.log('Listening on 3000');
	});
});

app.get('/', (req, res) =>{
	db.collection('quotes').find().toArray((err, result) => {
		if (err) return console.log(err)
		res.render('index.ejs', {quotes: result});
	});
});

app.post('/quotes', (req, res) =>{
	console.log(req.body);
	db.collection('quotes').save(req.body, (err, result) => {
		if(err) return console.log(err);

		console.log('saved to database');
		res.redirect('/');
	});
});

app.put('/quotes', (req, res) => {
	//handle put request
	db.collection('quotes')
	.findOneAndUpdate({name: 'Yoda'}, {
		$set: {
			name: req.body.name,
			quote: req.body.quote
		}
	}, {
		sort: {_id: -1},
		upsert: true
	}, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	});
});

app.delete('/quotes', (req, res) => {
	db.collection('quotes').findOneAndDelete({name: req.body.name},
	(err, result) => {
		if (err) return res.send(500, err);
		res.send({ message: 'A Darth Vader quote was deleted'});
	});
});