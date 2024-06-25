const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course-controllers');

// Create a new course
router.post('/courses', courseController.createCourse);

// Get course by ID
router.get('/courses/:courseId', courseController.getCourseById);

module.exports = router;
