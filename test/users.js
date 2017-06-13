var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../bin/www');
var User = require('../models/users');

chai.use(chaiHttp);

// testing the user model
describe('User', function() {
	it('should be invalid if first name is empty', function(done) {
		var user = new User();
		user.validate(function(err) {
			expect(err.errors.first_name).to.exist;
			done();
		});
	});
	it('should be invalid if last name is empty', function(done) {
		var user = new User();
		user.validate(function(err) {
			expect(err.errors.last_name).to.exist;
			done();
		});
	});
	it('should be invalid if username (_id) is empty', function(done) {
		var user = new User();
		user.validate(function(err) {
			expect(err.errors._id).to.exist;
			done();
		});
	});
	it('should be invalid if password is empty', function(done) {
		var user = new User();
		user.validate(function(err) {
			expect(err.errors.pw).to.exist;
			done();
		});
	});
});

describe('GET /users', function() {
    it('should get unauthorized status code', function (done) {
    	chai.request(server)
        .get('/users')
        .end(function(err, res){
	        expect(res).to.have.status(401);
           	done();
        });
    });
});
