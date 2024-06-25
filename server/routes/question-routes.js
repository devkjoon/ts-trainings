const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question-controllers');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.createQuestion);

module.exports = router;
