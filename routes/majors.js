var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var Major = require('../models/majors');
var majorFuncs = require('../data/majors');

var majors_model = {
  major:  "Test",
  requirements: 2,
  electives:   2,
  upper: 2,
  lower: 2,
  total: 2
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(majors_model);

var file = "./excel_files/majors.xlsx";

/* Render all majors from databse */
router.get('/', function(req, res, next) {
	console.log('received a request for get /majors/');
	majorFuncs.findAll(function(err, majors){
		if (err) return res.sendStatus(500);
		return res.send(majors);
	})
});


/* Convert excel files to JSON and then add to database */
router.post('/', function(req, res, next) {
	console.log('received a request for post /majors/');
	majorFuncs.convertExcel(file, model, function(err, success){
		if (err) return res.sendStatus(500);
		if (success) {
			res.send(201)
		} else {
			res.send(200);	
		}
	})
});

module.exports = router;