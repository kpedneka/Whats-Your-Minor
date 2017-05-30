var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var minors = require('../models/dilutions');

var minors_model = {
  minor:  "Economics",
  requirements: 2,
  electives:   2,
  upper: 2,
  lower: 2,
  total: 2
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(minors_model);

var file = "./excel_files/minors.xlsx";

/* GET all posts page. */
router.get('/', function(req, res, next) {
	console.log('received request for get');
  	minors.find({}, function(err, minors) {
    var minorsArray = {};

    minors.forEach(function(minor) {
      minorsArray[minor._id] = minor;
    });

    res.send(minorsArray);
  });
});

router.post('/', function(req, res, next) {
	console.log('received a request for post');
	var insertedNew = false;
	var exists = 0;
	var inserted = 0;
	/* Read Excel */
	mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
		// console.log('Mongo data:', mongoData); 
		mongoData.filter((entry) => {
			if (entry.minor != null){
				
				// try to find it, if it's not there then call add, save to db
				minors.find({minor: entry.minor}, function (err, doc) {
					if (err) return console.error(err);
					// if doc is null, doc.length == 0
					if (doc.length){
						exists ++;
					} else {
						// create new minor object from mongoData entry
						var newMinor =	new minors({ 
								minor:  entry.minor,
								requirements: entry.requirements,
								electives:   entry.electives,
								upper: entry.upper,
								lower: entry.lower,
								total: entry.total 
							});
						newMinor.save(function (err, concentration) {
							if (err) return console.error(err);
							inserted ++;
						});	
					}
				});
			}
			// if minor == null, skip it
		});

	});
	// logging is not working as expected. Damn asynchronous calls!!
	// it is printing 0 exists and returning 304 before the filter function returns!
	if(insertedNew){
		// created
		console.log('created %d new minors', inserted);
		res.sendStatus(201);
	} else {
		// not modified
		console.log('file contained %d existing minors', exists);
		res.sendStatus(304);
	}
});

module.exports = router;