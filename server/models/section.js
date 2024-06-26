const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  resource: {
    type: { type: String, enum: ['video', 'powerpoint'], required: true},
    url: { type: String, required: true }
  },
  quiz: {
    questions: [{
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true }
    }]
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Section', sectionSchema);
