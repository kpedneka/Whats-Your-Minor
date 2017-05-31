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

/* GET fetches excel files and adds majors to db, then redirects to /all */
router.get('/', function(req, res, next) {
	console.log('received a request for post');
	var insertedNew = false;
	var exists = 0;
	var inserted = 0;
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
		
		function done(){
			if (exists + inserted == mongoData.length){
				if(insertedNew){
					// created
					console.log('created %d new majors', inserted);
					console.log('about to redirect to /majors/all...');
					res.redirect('/majors/all');
				} else {
					// not modified at all
					console.log('file contained %d existing majors', exists);
					console.log('about to redirect to /majors/all...');
					res.redirect('/majors/all');
				}
			}
		}
	});
});


/* GET all posts page. */
router.get('/all', function(req, res, next) {
	console.log('received request for get /majors/all');
  	majors.find({}, function(err, majors) {
    var majorsArray = {};
    console.log('now sending majors from db...')
    majors.forEach(function(major) {
      majorsArray[major._id] = major;
    });

    res.send(majorsArray);
  });
});

module.exports = router;