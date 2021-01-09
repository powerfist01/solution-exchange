const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  fullname: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: false
  },
  last_paid: {
    type: Number,
    required: false,
  },
  total_assignments: {
    type: Number,
    required: false,
  },
  total_paid: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user','expert','admin']
  },
  subject:{
    type: Array
  },
  date_of_joining: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
