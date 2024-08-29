const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    certificationNumber: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    completionDate: { type: Date, required: true }
})

module.exports = mongoose.model('Certification', certificationSchema);