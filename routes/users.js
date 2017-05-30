var express = require('express');
var url = require('url');
var router = express.Router();

var rows = {}; // indexed by y-position

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


/* GET single user. */
router.get('/:username', function(req, res, next){
	// validate data

	users.findOne({username: req.params.username}, function (err, user) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		}
		// if user is null, return 404, else return user
		if (!user){
			console.log('No such user');
			return res.sendStatus(404);
		}
		console.log('found '+ user);
		return res.send(user);
	});
});


/* POST users list. */
router.post('/', function(req, res, next) {
	// validate data

	var newUser = new users({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		majors: req.body.majors,
		minors: req.body.minors
	});
	users.findOne({username: req.body.username}, function(err, user){
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		// if user is not null, it already exists
		if (user) {
			console.log('user already exists');
			return res.sendStatus(200)
		}
		else {
			newUser.save(function(err, success){
				if (err) {
					console.log(err);
					return res.sendStatus(500);
				}
				console.log('saved new user');
				console.log('majors are '+ req.body.majors)
				return res.sendStatus(201);
			});
		}

	});
});


/* PUT users list. */
router.put('/:username', function(req, res, next){
	// validate data req.body and maybe even req.params
	
	users.findOne({username: req.params.username}, function(err, user){
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		// if user is exists, modify all fields that were provided by form
		if (user) {
			if (req.body.username)
				user.username = req.body.username;
			if (req.body.first_name)
				user.first_name = req.body.first_name;
			if (req.body.last_name)
				user.last_name = req.body.last_name;
			if (req.body.majors)
				user.majors = req.body.majors;
			if (req.body.minors)
				user.minors = req.body.minors;
			
			user.save(function(err, success){
				console.log('updated information for user: '+ user.username);
				return res.sendStatus(200);
			})
		}
		else {
			// if user is null, no such user
			return res.sendStatus(404);
		}
	});
});

module.exports = router;
