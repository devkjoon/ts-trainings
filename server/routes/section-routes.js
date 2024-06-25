const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section-controllers');

// Create a new section
router.post('/sections', sectionController.createSection);

// Get section by ID
router.get('/sections/:sectionId', sectionController.getSectionById);

module.exports = router;
