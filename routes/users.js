var express = require('express');
var url = require('url');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var passportJWT = require('passport-jwt');

var app = express();
var User = require('../models/users');
//userFuncs contains database functions about users model
var userFuncs = require('../data/users');

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
// Choose the secret wisely or use a private key.
jwtOptions.secretOrKey = 'tasmanianDevil';

// this is the strategy used to authenticate a user
var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // this is a database call to look up the user and call next:
  userFuncs.findUser({ username : jwt_payload.username }, next);
});


passport.use(strategy);

app.use(passport.initialize());


router.post('/login', function(req, res, next) {
	console.log('login page route\n\n');

	// this is a database call:
	userFuncs.findUser({username: req.body.username}, showProfile);

	function showProfile(err, user){
		console.log('in show profile')
		if (user){
			console.log('user exists! '+ user.username);
			if(user.pw === req.body.pw) {
			    // from now on we'll identify the user by the username 
			    // and the username is the only personalized value that goes into our token
			    var payload = {username: user.username};
			    var token = jwt.sign(payload, jwtOptions.secretOrKey);
			   	return res.json({message: "you are signed in now", token: token});
			} else {
			    return res.status(401).json({message:"passwords did not match"});
			}
		}
		// user not found
		return res.sendStatus(404);
	}
});


/* GET single user. */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next){
	// validate data

	userFuncs.findUser({username: req.user.username}, foundUser);

	function foundUser (err, user){
		if (err) {
			console.log('there was an error in findUser');
		}
		// double checking the user's attributes here, just to be safe
		if (user.username === req.user.username) {
			// if the user found is not null, send it
			console.log('sending back this user\n'+user);

			return res.send(user);
		}
		// if the user found was null, does not exist
		console.log('user does not exist or no authorization');
		return res.sendStatus(401);
	}
});


/* POST users list. Use this to create a new user */
router.post('/', function(req, res, next) {
	// validate data

	var newUser = new User({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		username: req.body.username,
		pw: req.body.pw,
		majors: req.body.majors,
		minors: req.body.minors
	});

	userFuncs.findUser(newUser, userFuncs.saveNew);
});


module.exports = router;
