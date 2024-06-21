const mongoose = require('mongoose');

const adminCodeSchema = new mongoose.Schema ({
    adminCode: { type: Sting, required: true }
})

module.exports = mongoose.model('AdminCode', adminCodeSchema)