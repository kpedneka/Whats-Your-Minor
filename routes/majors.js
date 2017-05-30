var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var majors = require('../models/concentrations');

var majors_model = {
  major:  "Economics",
  requirements: 2,
  electives:   2,
  upper: 2,
  lower: 2,
  total: 2
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(majors_model);

var file = "./excel_files/majors.xlsx";

/* GET all posts page. */
router.get('/', function(req, res, next) {
	console.log('received request for get');
  	majors.find({}, function(err, majors) {
    var majorsArray = {};

    majors.forEach(function(major) {
      majorsArray[major._id] = major;
    });

    res.send(majorsArray);
  });
});

router.post('/', function(req, res, next) {
	console.log('received a request for post');
	var insertedNew = false;
	
	/* Read Excel */
	mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
		// console.log('Mongo data:', mongoData); 
		mongoData.filter((entry) => {
			if (entry.major != null){
				
				// try to find it, if it's not there then call add, save to db
				majors.find({major: entry.major}, function (err, doc) {
					if (err) return console.error(err);
					// if doc is null, doc.length == 0
					if (doc.length){
						console.log('exists already!');
					} else {
						// create new majors object from mongoData entry
						var newMajor =	new majors({ 
								major:  entry.major,
								requirements: entry.requirements,
								electives:   entry.electives,
								upper: entry.upper,
								lower: entry.lower,
								total: entry.total 
							});
						newMajor.save(function (err, concentration) {
						if (err) return console.error(err);
							console.log('successfully added '+ concentration.major);
						});	
					}
				});
			}
			// if major == null, skip it
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