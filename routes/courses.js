var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var courses = require('../models/classes');

var course_model = { 
	course_no: "01-220-102", 
	course_name: "Introduction to Microeconomics", 
	department: "Economics", 
	major_requirement: "Yes", 
	minor_requirement: "No", 
	upper: "No", 
	lower: "No", 
	major: "Economics" 
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(course_model);

// list of courses
var files = ["./excel_files/econ.xlsx", "./excel_files/it.xlsx", "./excel_files/pol.xlsx"];



/* GET fetches excel files and adds courses to db, then redirects to /all */
router.get('/', function(req, res, next) {
	console.log('received a request for get /courses');
	var insertedNew = false;
	var exists = Number(0);
	var inserted = Number(0);
	var empty = 0;
	var sum = 0;
	// get stuff from excel file and insert
	files.forEach(function (file) {
	
		/* Read Excel */
		mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
			console.log('Mongo data length:', mongoData.length); 
			console.log('file name : '+file);
			sum += mongoData.length;
			mongoData.filter((entry) => {
				if (entry.major != null){
					
					// try to find it, if it's not there then call add, save to db
					courses.findOne({course_no: entry.course_no}, function(err, found){
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						}
						// if course is not null, it already exists
						if (found) {
							// console.log('course already exists');
							exists ++;
							done();
						}
						else {
							// create new major object from mongoData entry
							var newCourse =	new courses({ 
								course_no: entry.course_no,
								course_name: entry.course_name,
								department: entry.department,
								major_requirement: entry.major_requirement,
								minor_requirement: entry.minor_requirement,
								upper: entry.upper,
								lower: entry.lower,
								total: entry.total 
							});
							newCourse.save(function(err, success){
								if (err) {
									console.log(err);
									return res.sendStatus(500);
								}
								// console.log('saved new course');
								inserted ++;
								insertedNew = true;
								done();
							});
						}
					});
				}
				// if course == null, increment empty
				else {
					empty ++;
				}
			});
			function done(){
				// only when empty + exits + inserted match the sum, call redirect
				if (empty + exists + inserted === sum ){
					if(insertedNew){
						// created
						console.log('created %d new courses', inserted);
						console.log('found %d empty courses in data', empty);
						console.log('found %d existing courses in data', exists);
						console.log('about to redirect to /coursers/all...');
						return res.redirect('/courses/all');
					} else {
						// not modified at all
						console.log('file contained %d existing courses', exists);
						console.log('found %d empty courses in data', empty);
						console.log('found %d new courses in data', inserted);
						console.log('about to redirect to /courses/all...');
						return res.redirect('/courses/all');
					}
				}
			}
		});	
	});
});


/* GET all courses from db and display them */
router.get('/all', function(req, res, next) {
	console.log('received request for get /courses/all');
  	courses.find({}, function(err, courses) {
    var coursesArray = {};
    console.log('now sending courses from db...');
    courses.forEach(function(course) {
      coursesArray[course._id] = course;
    });

    res.send(coursesArray);
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
module.exports = router;