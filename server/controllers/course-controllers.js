const Course = require('../models/course');
const { validationResult } = require('express-validator');

// Create a new course
exports.createCourse = async (req, res) => {
  // Validate input using express-validator or similar
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description } = req.body;
    const course = new Course({ title, description });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('sections');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
