var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../bin/www');
var Minor = require('../models/minors');

// testing minor model
describe('Minor', function() {
	it('should be invalid if course name is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors._id).to.exist;
			done();
		});
	});
	it('should be invalid if electives is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors.electives).to.exist;
			done();
		});
	});
	it('should be invalid if requirements is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors.requirements).to.exist;
			done();
		});
	});
	it('should be invalid if upper is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors.upper).to.exist;
			done();
		});
	});
	it('should be invalid if lower is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors.lower).to.exist;
			done();
		});
	});
	it('should be invalid if total is empty', function() {
		var minor = new Minor();
		minor.validate(function(err){
			expect(err.errors.total).to.exist;
			done();
		});
	});
});

describe('GET /minors', function() {
    it('should get ok status code', function (done) {
    	chai.request(server)
        .get('/minors')
        .end(function(err, res){
        	expect(err).to.be.null;
           	expect(res).to.have.status(200);
           	expect(res.body).to.be.a('array');
           	done();
        });
    });
});
