const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true },
    confirmationCode: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema);