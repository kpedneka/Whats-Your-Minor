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

/* GET all courses. */
router.get('/', function(req, res, next) {
	console.log('received request for get');
  	courses.find({}, function(err, courses) {
    var coursesArray = {};

    courses.forEach(function(course) {
      coursesArray[course._id] = course;
    });

    res.send(coursesArray);
  });
});

/* GET courses by course_no. */
router.get('/:course_no', function(req, res, next) {
	console.log('received request for get by course_no');
	console.log('course_no: '+ req.params.course_no);
  	courses.find({course_no: req.params.course_no}, function(err, courses) {
  		if (err) return console.error(err);
	    var coursesArray = {};

	    courses.forEach(function(course) {
	      coursesArray[course._id] = course;
	    });

	    res.send(coursesArray);
	});
});

// /* GET courses by department. Does not work bc confuses with course_no. Same type (String)*/
// router.get('/:department', function(req, res, next) {
// 	console.log('received request for get by department');
// 	console.log('course_no: '+ req.params.department);
//   	courses.find({course_no: req.params.department}, function(err, courses) {
//   		if (err) return console.error(err);
// 	    var coursesArray = {};

// 	    courses.forEach(function(course) {
// 	      coursesArray[course._id] = course;
// 	    });

// 	    res.send(coursesArray);
// 	});
// });


router.post('/', function(req, res, next) {
	console.log('received a request for post');
	var insertedNew = false;
	var exists = Number(0);
	var inserted = Number(0);
	// get stuff from excel file and insert
	files.forEach(function (file) {
	
		/* Read Excel */
		mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
			// console.log('Mongo data:', mongoData); 
			mongoData.filter((entry) => {
				if (entry.major != null){
					
					// try to find it, if it's not there then call add, save to db
					majors.findOne({major: entry.major}, function(err, found){
						if (err) {
							console.log(err);
							return res.sendStatus(500);
						}
						// if major is not null, it already exists
						if (found) {
							// console.log('major already exists');
							exists ++;
							done();
						}
						else {
							// create new major object from mongoData entry
							var newMajor =	new majors({ 
								major:  entry.major,
								requirements: entry.requirements,
								electives:   entry.electives,
								upper: entry.upper,
								lower: entry.lower,
								total: entry.total 
							});
							newMajor.save(function(err, success){
								if (err) {
									console.log(err);
									return res.sendStatus(500);
								}
								// console.log('saved new major');
								inserted ++;
								insertedNew = true;
								done();
							});
						}
					});
				}
				// if major == null, skip it
			});
		});	
	});
	function done(){
		if (exists + inserted == mongoData.length){
			if(insertedNew){
				// created
				console.log('created %d new majors', inserted);
				return res.sendStatus(201);
			} else {
				// not modified at all
				console.log('file contained %d existing majors', exists);
				return res.sendStatus(304);
			}
		}
	}
});

module.exports = router;