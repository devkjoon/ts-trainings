const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question-controllers');

router.get('/', questionController.getAllQuestions);
router.post('/', questionController.createQuestion);
router.get('/:questionId', questionController.getQuestionById);
router.put('/:questionId', questionController.updateQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;
