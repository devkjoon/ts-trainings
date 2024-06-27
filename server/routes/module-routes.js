const express = require('express');
const { check } = require('express-validator');

const moduleController = require('../controllers/module-controllers');

const router = express.Router();

router.get('/', moduleController.getModules);
router.get('/:mid', moduleController.getModuleById);
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('resource.type').isIn(['video', 'powerpoint']),
    check('resource.url').not().isEmpty()
  ],
  moduleController.createModule
);

router.post('/:sid/submit-quiz', moduleController.submitQuiz);

module.exports = router;
