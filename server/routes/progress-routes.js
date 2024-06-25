const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress-controllers');

// Update progress
router.post('/progress', progressController.updateProgress);

// Get progress by student ID and course ID
router.get('/progress/:studentId/:courseId', progressController.getProgress);

module.exports = router;
