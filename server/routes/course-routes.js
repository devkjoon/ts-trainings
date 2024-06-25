const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course-controllers');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.createCourse);

module.exports = router;

