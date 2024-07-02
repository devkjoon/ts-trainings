const express = require("express");
const { check } = require("express-validator");
const adminAuth = require('../middleware/adminAuth');

const adminController = require("../controllers/admin-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("adminCode").not().isEmpty(),
  ],
  adminController.signup
);

router.post("/login", adminController.login);

router.use(adminAuth)

router.get("/", adminController.getAdmins)

module.exports = router;
