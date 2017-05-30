var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var minorSchema = new Schema({
  minor:  String,
  requirements: Number,
  electives:   Number,
  upper: Number,
  lower: Number,
  total: Number
});

module.exports = mongoose.model('Minor', minorSchema);
