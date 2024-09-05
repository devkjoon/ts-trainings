const express = require('express');
const emailController = require('../controllers/email-controllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.post('/forgot-login-code', emailController.forgotLoginCode);

// Protected routes
router.use(adminAuth);

router.post('/send-login-code', emailController.sendLoginCode);
router.post('/resend-certificate', emailController.resendCertificate); 

module.exports = router;
