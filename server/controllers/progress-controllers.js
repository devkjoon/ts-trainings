const Progress = require('../models/progress');
const { validationResult } = require('express-validator');

// Update progress
exports.updateProgress = async (req, res) => {
  // Validate input using express-validator or similar
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { studentId, courseId, completedSections } = req.body;

    // Update progress or create new if not exists
    let progress = await Progress.findOne({ studentId, courseId });

    if (!progress) {
      progress = new Progress({ studentId, courseId, completedSections });
    } else {
      progress.completedSections = completedSections;
    }

    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get progress by student ID and course ID
exports.getProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const progress = await Progress.findOne({ studentId, courseId });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
