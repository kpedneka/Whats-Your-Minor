var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var Course = require('../models/classes');
var courseFuncs = require('../data/courses');

var course_model = { 
	course_no: "01-220-102", 
	course_name: "Introduction to Microeconomics", 
	department: "Economics", 
	major_requirement: "Yes", 
	major: "Economics" 
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(course_model);

// list of courses
var files = ["./excel_files/econ.xlsx", "./excel_files/it.xlsx", "./excel_files/pol.xlsx"];


/* GET fetches excel files and adds courses to db */
router.get('/', function(req, res, next) {
	console.log('received a request for get /courses/');
	courseFuncs.findAll(function(err, courses){
		if (err) return res.sendStatus(500);
		return res.send(courses);
	});
});


/* GET courses by course_no. */
router.get('/:course_no', function(req, res, next) {
	console.log('received request for get /courses/'+req.params.course_no);
	console.log('course_no: '+ req.params.course_no);
  	courses.find({course_no: req.params.course_no}, function(err, courses) {
  		if (err) return console.error(err);
	    var coursesArray = {};
	    console.log('now sending courses from db...');
	    courses.forEach(function(course) {
	      coursesArray[course._id] = course;
	    });

	    res.send(coursesArray);
	});
});

/* Convert excel files to JSON and then add to database */
router.post('/', function(req, res, next) {
	console.log('received a request for post /courses/');
	courseFuncs.convertExcel(files, model, function(err, success){
		if (err) return console.log('there was an error')
		if (success) {
			res.sendStatus(201)
		} else {
			res.sendStatus(200);	
		}
	})
});


module.exports = router;