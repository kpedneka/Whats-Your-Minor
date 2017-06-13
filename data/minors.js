var Minor = require('../models/minors');
var mongoXlsx = require('mongo-xlsx');
var bodyParser = require('body-parser');

exports.convertExcel = function (file, model, callback) {
	var resolvedPromise = Promise.resolve();
	var added = false;
	var count = 0;
	mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
		var filtered = mongoData.filter(function(entry){
			if(entry.length !== 0) return entry;
		})
		var saved = filtered.forEach(function(entry){
			resolvedPromise = resolvedPromise.then(function(){
				var newMinor = new Minor({
					_id: entry.minor,
					requirements: entry.requirements,
				    electives: entry.electives,
				    upper: entry.upper,
				    lower: entry.lower,
				    total: entry.total
				})
				newMinor.save(function(err, done){
					if (err) {
						console.log('there was an error, id already exists!');
					} else {
						added = true;
						console.log('saved ', newMinor._id);
					}
				})
			})
			.then(function() {
				count ++;
				if (count == mongoData.length) callback(null, added);
			})
			.catch(function(err){
				console.log('there was an err in convertExcel');
			})
		});
	})
};

exports.findAll = function (callback) {
	Minor.find({})
	.then(function(minors){
		callback(null, minors);
	});
};