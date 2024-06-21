const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true },
    adminCode: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

