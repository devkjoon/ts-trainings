const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    address: {
        streetAddress: { type: String, required: true },
        streetAddress2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: Number, required: true }
    },
    contact: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: Number, required: true }
    }
})

module.exports = mongoose.model('Contractor', contractorSchema);