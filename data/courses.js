var Course = require('../models/classes');
var mongoXlsx = require('mongo-xlsx');
var bodyParser = require('body-parser');


exports.convertExcel = function (files, model, callback) {
	var resolvedPromise = Promise.resolve();
	var added = false;
	var count = 0;
	var completed = files.forEach(function(file) {
		resolvedPromise = resolvedPromise.then(function(){
			mongoXlsx.xlsx2MongoData(file, model, function(err, mongoData) {
				var filtered = mongoData.filter(function(entry){
					if(entry.length !== 0) return entry;
				})
				var saved = filtered.forEach(function(entry){
					resolvedPromise = resolvedPromise.then(function(){
						var newCourse = new Course({
							course_no: entry.course_no,
							course_name: entry.course_name,
							department: entry.department,
							major_requirement: entry.major_requirement,
							major: entry.major
						})
						newCourse.save(function(err, done){
							if (err) {
								// console.log('there was an error in saving course ', newCourse.course_name);
							} else {
								added = true;
								// console.log('saved ', newCourse.course_name);
							}
						})
					})
				});
			})
		})
	.then(function() {
		count ++;
		if (count == files.length) callback(null, added);
	})
	.catch(function(err){
		console.log('there was an err in convertExcel');
	})

	})
};


exports.findAll = function (callback) {
	Course.find({})
	.then(function(courses){
		callback(null, courses);
	})
};