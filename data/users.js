var User = require('../models/users');

exports.findAll = function (callback) {
	User.find({}, function(err, users){
		if (err){
			console.log('error while looking up user');
			callback(err, null);
		}

		if (users.length){
			// console.log('user exists '+ users[0]);
			callback(null, users);
		}
		else {
			// console.log('user does not exist');
			callback(null, null, users);
		}
	});
};

exports.findUser = function (user, callback) {
	console.log(user.username);
	User.find({username: user.username}, function(err, users){
		if (err){
			console.log('error while looking up user');
			callback(err, null);
		}

		if (users.length){
			// console.log('user exists '+ users[0]);
			callback(null, users[0]);
		}
		else {
			// console.log('user does not exist');
			callback(null, null, user);
		}
	});
};

exports.saveNew = function (err, user, newUser) {
	if (err) {
		console.log('error while saving new user');
		return console.error(err);
	}
	if (user === null) {
		newUser.save(function(err, success){
			if (err){
				console.log('there was an error in saving');
				console.error(err);
			}
			console.log('successfully saved '+ newUser.username);
		})
	}
};

exports.updateUser = function (user, callback) {
	// this means that you can only update the majors and the minors
	User.findOneAndUpdate({username: user.username}, {$set:{majors:user.majors, minors: user.minors}}, {new: true}, function(err, user){
	    if(err){
	        console.log('error while updating user');
	        callback(err, null);
	    }

	    console.log('updated user\n'+user);
	});
};