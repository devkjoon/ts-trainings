const Section = require('../models/section');
const Quiz = require('../models/quiz');
const { validationResult } = require('express-validator');

// Create a new section
exports.createSection = async (req, res) => {
  // Validate input using express-validator or similar
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, contentType, contentUrl, quizData, courseId } = req.body;
    
    // Create a new quiz if quizData is provided
    let quiz = null;
    if (quizData) {
      quiz = new Quiz({ questions: quizData });
      await quiz.save();
    }

    // Create the section
    const section = new Section({
      title,
      contentType,
      contentUrl,
      quiz: quiz ? quiz._id : null,
      courseId,
    });
    await section.save();

    res.status(201).json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get section by ID
exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId).populate('quiz');
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
