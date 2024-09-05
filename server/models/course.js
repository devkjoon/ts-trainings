const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  moduleIconUrl: { type: String },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  details: {
    primary: { type: String },
    secondary: { type: String },
  },
  price: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
