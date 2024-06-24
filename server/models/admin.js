const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, minlength: 4 },
    password: { type: String, required: true }
});

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Admin', adminSchema);

