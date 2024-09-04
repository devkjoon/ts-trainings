const mongoose = require('mongoose');

const courseAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  assignedAt: { type: Date, default: Date.now },
  completedAt: Date,
  progress: { type: Number, default: 0 }, // percentage of course completed
  priceAtAssignment: { type: Number, required: true }, // Store the price at the time of assignment
  revenue: { type: Number, required: true }, // This could be different from price if there are discounts
  status: { type: String, enum: ['assigned', 'in_progress', 'completed'], default: 'assigned' }
});

module.exports = mongoose.model('CourseAssignment', courseAssignmentSchema);