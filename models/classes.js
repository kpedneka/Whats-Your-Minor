var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var classSchema = new Schema({
  course_no:  {type: String, required: [true, 'Course must have a course number']},
  course_name: {type: String, required: [true, 'Course must have a course_name']},
  department: {type: String, required: [true, 'Course must have a department']},
  major_requirement: {type: String, required: [true, 'Course must have a major requirement']},
  major: {type: String, required: [true, 'Course must have a major']}
});

module.exports = mongoose.model('Course', classSchema);