const express = require("express");
const { check } = require("express-validator");

const studentController = require("../controllers/student-controllers");

const router = express.Router();

router.get("/", studentController.getStudents);

router.post(
  "/create",
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

router.post("/login", studentController.login);

module.exports = router;
