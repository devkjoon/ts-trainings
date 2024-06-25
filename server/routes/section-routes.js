const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section-controllers');

// Create a new section
router.post('/', sectionController.createSection);

// Get section by ID
router.get('/:sectionId', sectionController.getSectionById);

module.exports = router;
