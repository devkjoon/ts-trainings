const mongoose = require('mongoose');
const Company = require('./company');

const studentSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company'}, 
    email: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema)

