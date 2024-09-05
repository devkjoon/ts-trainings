const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, minlength: 4 },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

adminSchema.plugin(uniqueValidator);

adminSchema.methods.generatePasswordReset = function () {
  const token = jwt.sign({ userId: this._id }, process.env.ADMIN_TOKEN, { expiresIn: '1h' });
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
};

module.exports = mongoose.model('Admin', adminSchema);
