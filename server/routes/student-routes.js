const express = require("express");
const { check } = require("express-validator");
const adminAuth = require('../middleware/adminAuth');

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

router.post(
    "/newStudent",
    [
        check("firstname").not().isEmpty(),
        check("lastname").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("company").not().isEmpty(),
    ],
    studentController.newStudent
    );

router.delete("/:sid", studentController.deleteStudent);

router.get('/', studentController.getAllStudents);
    
module.exports = router;
