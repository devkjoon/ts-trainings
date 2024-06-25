const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({ 
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: Number, required: true }
});

module.exports = mongoose.model('Video', videoSchema);