const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  order: { type: Number },
  resource: {
    type: { type: String, enum: ['video', 'powerpoint'] },
    url: { type: String }
  },
  quiz: {
    questions: [{
      question: { type: String },
      options: [{ type: String }],
      correctAnswer: { type: Number }
    }]
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Module', moduleSchema);
