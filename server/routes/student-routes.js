const express = require('express');
const { check } = require('express-validator');
const adminAuth = require('../middleware/adminAuth');

const studentController = require('../controllers/student-controllers');

const router = express.Router();

// Public routes
router.post(
  '/login',
  [check('email').normalizeEmail().isEmail(), check('loginCode').not().isEmpty()],
  studentController.login
);

router.post(
  '/newStudent',
  [
    check('firstname').not().isEmpty(),
    check('lastname').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('company').not().isEmpty(),
  ],
  studentController.newStudent
);

// Semi-public routes (might need different authentication)
router.get('/:sid/courses', studentController.getStudentCourses);
router.get('/:sid/completed-modules', studentController.getCompletedModules);

// Protected routes
router.use(adminAuth);

router.get('/', studentController.getAllStudents);
router.post('/:sid/assign-course', studentController.assignCourse);
router.delete('/:sid', studentController.deleteStudent);
router.put(
  '/:sid',
  [
    check('firstname').not().isEmpty(),
    check('lastname').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('company').not().isEmpty(),
  ],
  studentController.updateStudent
);

module.exports = router;
