const express = require('express');
const emailController = require('../controllers/email-controllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.use(adminAuth);

router.post('/send-student-login-code', emailController.sendStudentLoginCode);

router.post('/resend-certificate', emailController.resendCertificate);

module.exports = router;
