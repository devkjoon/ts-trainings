const express = require('express');
const analyticsControllers = require('../controllers/analytics-controllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.use(adminAuth); // Protect all analytics routes

router.get('/course-enrollment-revenue', analyticsControllers.getCourseEnrollmentAndRevenueData);

router.get('/monthly-revenue', analyticsControllers.getMonthlyRevenueData);

router.get('/course-analytics', analyticsControllers.getCourseAnalytics);

module.exports = router;