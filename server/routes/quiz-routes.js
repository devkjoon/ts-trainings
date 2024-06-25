const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz-controllers');

// Create a new quiz
router.post('/quizzes', quizController.createQuiz);

// Get quiz by ID
router.get('/quizzes/:quizId', quizController.getQuizById);

module.exports = router;
