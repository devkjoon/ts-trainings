const express = require('express');
const adminAuth = require('../middleware/adminAuth');

const companyController = require('../controllers/company-controllers');

const router = express.Router();

router.get('/', adminAuth, companyController.getAllCompanies);

router.post('/new-company', adminAuth, companyController.newCompany);

router.delete('/:cid', adminAuth, companyController.deleteCompany);

module.exports = router;