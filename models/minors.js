var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var minorSchema = new Schema({
  _id: {type: String, unique: true, required: [true, 'you must have a course name']},
  requirements: {type: Number, required: [true, 'Minor must have a requirements']},
  electives: {type: Number, required: [true, 'Minor must have electives']},
  upper: {type: Number, required: [true, 'Minor must have an upper']},
  lower: {type: Number, required: [true, 'Minor must have a lower']},
  total: {type: Number, required: [true, 'Minor must have a total']}
});

module.exports = mongoose.model('Minor', minorSchema);
