const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz-controllers');

// Create a new quiz
router.post('/', quizController.createQuiz);

// Get quiz by ID
router.get('/:quizId', quizController.getQuizById);

module.exports = router;
