const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: Number,
    required: true,
    min: 1,
    max: 9999
  },
  hostel: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    min: 1000000000,
    max: 9999999999
  },
  admin: {
    type: Boolean,
    default: false
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
