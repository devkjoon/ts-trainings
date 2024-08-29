const express = require('express');
const { check } = require('express-validator');

const certificationController = require('../controllers/certification-controllers');

const router = express.Router();

router.get('/verify-certficiation', certificationController.verifyCertification);

module.exports = router;