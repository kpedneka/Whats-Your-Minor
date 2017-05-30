var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var majorSchema = new Schema({
  major:  String,
  requirements: Number,
  electives:   Number,
  upper: Number,
  lower: Number,
  total: Number
});

module.exports = mongoose.model('Major', majorSchema);
