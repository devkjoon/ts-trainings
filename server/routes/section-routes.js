const express = require('express');
const { check } = require('express-validator');

const sectionController = require('../controllers/section-controllers');

const router = express.Router();

router.get('/', sectionController.getSections);
router.get('/:sid', sectionController.getSectionById);
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('resource.type').isIn(['video', 'powerpoint']),
    check('resource.url').not().isEmpty()
  ],
  sectionController.createSection
);

router.post('/:sid/submit-quiz', sectionController.submitQuiz);

module.exports = router;
