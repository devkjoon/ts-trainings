const express = require("express");
const { check } = require("express-validator");
const checkAuth = require('../middleware/checkAuth');

const adminController = require("../controllers/admin-controllers");

const router = express.Router();

router.get("/", adminController.getAdmins)

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

module.exports = router;
