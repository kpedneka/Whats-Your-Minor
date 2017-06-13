var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

var server = require('../bin/www');
var Course = require('../models/classes');

// testing course model
describe('Course', function() {
	it('should be invalid if course number is empty', function() {
		var course = new Course();
		course.validate(function(err){
			expect(err.errors.course_no).to.exist;
			done();
		});
	});
	it('should be invalid if course name is empty', function() {
		var course = new Course();
		course.validate(function(err){
			expect(err.errors.course_name).to.exist;
			done();
		});
	});
	it('should be invalid if department is empty', function() {
		var course = new Course();
		course.validate(function(err){
			expect(err.errors.department).to.exist;
			done();
		});
	});
	it('should be invalid if major requirements is empty', function() {
		var course = new Course();
		course.validate(function(err){
			expect(err.errors.major_requirement).to.exist;
			done();
		});
	});
	it('should be invalid if major is empty', function() {
		var course = new Course();
		course.validate(function(err){
			expect(err.errors.major).to.exist;
			done();
		});
	});
});

describe('GET /courses', function() {
    it('should get ok status code', function (done) {
    	chai.request(server)
        .get('/courses')
        .end(function(err, res){
        	expect(err).to.be.null;
           	expect(res).to.have.status(200);
           	expect(res.body).to.be.a('array');
           	done();
        });
    });
});