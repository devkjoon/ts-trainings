const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: {
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true, maxlength: 2 },
        zipcode: { type: Number, required: true }
    },
    contact: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    }
});

module.exports = mongoose.model('Contractor', contractorSchema);
