const express = require('express');
const { check } = require('express-validator');

const companyController = require('../controllers/company-controllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.use(adminAuth);

router.get('/', companyController.getAllCompanies);

router.post('/new-company', companyController.newCompany);

router.delete('/:cid', companyController.deleteCompany);

router.put('/:cid', companyController.updateCompany);

module.exports = router;
