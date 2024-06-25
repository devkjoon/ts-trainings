const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate-controllers');

router.get('/', certificateController.getAllCertificates);
router.get('/:id', certificateController.getCertificateById);
router.post('/', certificateController.createCertificate);

module.exports = router;
