const express = require("express");
const { check } = require("express-validator");

const studentController = require("../controllers/student-controllers");

const router = express.Router();

router.get('/', studentController.getAllStudents);

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
    
module.exports = router;
