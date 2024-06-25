const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/userProgressController');

router.get('/', userProgressController.getAllUserProgress);
router.get('/:userId/:courseId', userProgressController.getUserProgressByUserAndCourse);
router.post('/', userProgressController.createUserProgress);
router.put('/:id', userProgressController.updateUserProgress);

module.exports = router;
