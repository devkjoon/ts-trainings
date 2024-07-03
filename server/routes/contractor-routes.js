const express = require('express');
const adminAuth = require('../middleware/adminAuth');

const contractorController = require('../controllers/contractor-controllers');

const router = express.Router();

router.get('/', adminAuth, contractorController.getAllContractors);

router.post('/new-contractor', adminAuth, contractorController.newContractor);

module.exports = router;