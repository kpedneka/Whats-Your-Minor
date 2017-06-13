var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  first_name: {type: String, required: [true, 'You must have a first name']},
  last_name: {type: String, required: [true, 'you must have a last name']},
  _id: {type: String, unique: true, required: [true, 'you must have a username']},
  pw: {type: String, required: [true, 'you must have a password']},
  majors: [{ type: Schema.Types.ObjectId, ref: 'Major' }],
  minors: [{ type: Schema.Types.ObjectId, ref: 'Minor' }]
});

module.exports = mongoose.model('User', userSchema);
