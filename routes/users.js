var express = require('express');
var router = express.Router();

var users = require('../models/users');

/* GET users list. */
router.get('/', function(req, res, next) {
	var allUsers = users.find({}, function (err, users){
		userArray = {}
		
		users.forEach(function(user){
			userArray[user._id] = user;
		});
		
		res.send(userArray);
	});
});

/* POST users list. */
router.post('/', function(req, res, next) {
	// validate data
	var newUser = new users({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		majors: req.body.major,
		minors: req.body.minor
	});
	users.find({first_name: req.body.first_name, last_name: req.body.last_name}, function(err, doc){
		if (err) return console.error(err);
		if (doc.length) {
			console.log('user already exists');
		}
		else {
			newUser.save(function(err, user){
				if (err) return console.error(err);
				console.log('saved new user');
			});
		}

	})
	console.log(req.body);
	res.sendStatus(200);
});

/* PUT users list. */
router.put('/', function(req, res, next){
	// validate data
	
});

module.exports = router;
