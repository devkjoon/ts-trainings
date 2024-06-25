const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    moduleProgress: [{
        module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
        completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true }],
        answeredQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }]
    }],
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);