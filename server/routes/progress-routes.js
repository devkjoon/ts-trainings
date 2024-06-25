const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress-controllers');

// Update progress
router.post('/', progressController.updateProgress);

// Get progress by student ID and course ID
router.get('/:studentId/:courseId', progressController.getProgress);

module.exports = router;
