const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'powerpoint'], required: true },
  contentUrl: { type: String, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Reference to Quiz model
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Section', sectionSchema);
