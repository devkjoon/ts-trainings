const express = require("express");
const { check } = require("express-validator");

const studentController = require("../controllers/student-controllers");

const router = express.Router();

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("loginCode").not().isEmpty()
  ],
  studentController.login
);

module.exports = router;
