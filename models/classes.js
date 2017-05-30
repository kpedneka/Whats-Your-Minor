var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var classSchema = new Schema({
  course_no:  String,
  course_name: String,
  department: String,
  major_requirement: String,
  minor_requirement: String,
  upper: String,
  lower: String,
  total: String
});

module.exports = mongoose.model('Class', classSchema);