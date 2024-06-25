const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
