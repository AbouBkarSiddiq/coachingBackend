const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'trainee'],
    default: 'trainee'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
