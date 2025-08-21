const mongoose = require('mongoose');

const hashPassword = require('../utils/hashPasswords');
const comparePasswords = require('../utils/comparePasswords');
const createToken = require('../utils/jwt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, provide a valid name.'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please, provide an email address.'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please, provide a valid email address.',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please, provide a valid password'],
    minlength: [6, 'Password must be at least 6 characters long.']
  },
});

// Hash the password *before* saving to the database
UserSchema.pre('save', async function () {
  this.password = await hashPassword(this.password);
});

// Add methods to the User document
UserSchema.methods.createJWT = function () {
  return createToken({ userId: this._id, name: this.name });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return comparePasswords(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
