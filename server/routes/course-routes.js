const express = require('express');
const { check } = require('express-validator');

const courseController = require('../controllers/course-controllers');

const router = express.Router();

router.get('/', courseController.getCourses);

router.get('/:cid', courseController.getCourseById);

router.get('/:cid/modules', courseController.getCourseModules);

router.post(
  '/',
  [check('title').not().isEmpty(), check('description').not().isEmpty()],
  courseController.createCourse
);
router.delete('/:cid', courseController.deleteCourse);

router.put('/:cid', courseController.updateCourse);

module.exports = router;
