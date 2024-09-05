const mongoose = require('mongoose');

const courseAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  assignedAt: { type: Date, default: Date.now },
  completedAt: Date,
  progress: { type: Number, default: 0 },
  revenue: { type: Number, required: true },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
});

module.exports = mongoose.model('CourseAssignment', courseAssignmentSchema);
