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
	// get stuff from excel file and insert
	files.forEach(function (file) {
	
		/* Read Excel */
		mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
			// console.log('Mongo data:', mongoData); 
			mongoData.filter((entry) => {
				if (entry.course_no != null){
					
					// try to find it, if it's not there then call add, save to db
					courses.find({course_no: entry.course_no}, function (err, doc) {
						if (err) return console.error(err);
						// if doc is null, doc.length == 0
						if (doc.length){
							console.log('exists already!');
						} else {
							// create new courses object from mongoData entry
							var newCourse =	new courses({ 
									course_no: entry.course_no, 
									course_name: entry.course_name, 
									department: entry.department, 
									major_requirement: entry.major_requirement, 
									minor_requirement: entry.minor_requirement, 
									upper: entry.upper, 
									lower: entry.lower, 
									major: entry.major 
								});
							newCourse.save(function (err, course) {
							if (err) return console.error(err);
								console.log('successfully added '+ course.course_no);
							});	
						}
					});
				}
				// if course_no == null, skip it
			});
		});
	});
	if(insertedNew){
		// created
		res.send(201);
	} else {
		// not modified
		res.send(304);
	}
	
});

module.exports = router;