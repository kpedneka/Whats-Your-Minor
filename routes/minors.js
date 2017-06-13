var express = require('express');
var mongoXlsx = require('mongo-xlsx');
var router = express.Router();
var bodyParser = require('body-parser');

var minorFuncs = require('../data/minors');

var minors_model = {
  _id:  "Economics",
  requirements: 2,
  electives:   2,
  upper: 2,
  lower: 2,
  total: 2
};

/* Generate automatic model for processing (A static model should be used) */
var model = mongoXlsx.buildDynamicModel(minors_model);

var file = "./excel_files/minors.xlsx";


/* GET fetches excel files and adds minors to db, then redirects to /all */
router.get('/', function(req, res, next) {
	console.log('received a request for get /minors/');
	
	minorFuncs.findAll(function(err, minors){
		if (err) return res.sendStatus(500);
		return res.send(minors);
	})
});

/* Convert excel files to JSON and then add to database */
router.post('/', function(req, res, next) {
	console.log('received a request for post /minors/');
	minorFuncs.convertExcel(file, model, function(err, success){
		if (err) return res.sendStatus(500);
		if (success) {
			res.send(201)
		} else {
			res.send(200);	
		}
	})
});

module.exports = router;