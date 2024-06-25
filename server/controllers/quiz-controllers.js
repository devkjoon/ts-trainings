const Quiz = require('../models/quiz');
const { validationResult } = require('express-validator');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  // Validate input using express-validator or similar
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { questions } = req.body;
    const quiz = new Quiz({ questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
