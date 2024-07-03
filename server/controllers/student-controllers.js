const { validationResult } = require("express-validator");
const Student = require("../models/student");
const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
require('../middleware/studentAuth');

const getAllStudents = async (req, res, next) => {
    let students;
    try {
      students = await Student.find({}, "-password");
    } catch (err) {
      const error = new HttpError(
        "Fetching students failed, please try again later.",
        500
      );
      return next(error);
    }
    
    res.json({
      students: students.map((student) => student.toObject({ getters: true })),
    });
  };

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your credentials', 422));
    }

    const { email, loginCode } = req.body;

    let existingStudent;

    try {
        existingStudent = await Student.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Login failed, please contact support", 500);
        console.log(err.message);
        return next(error);
    }

    if (!existingStudent) {
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    if (existingStudent.loginCode !== loginCode) {
        const error = new HttpError("Invalid credentials, could not log you in", 401);
        return next(error);
    }

    let token;

    try {
      token = jwt.sign(
        { userId: existingStudent.id, email: existingStudent.email, isAdmin: false },
        process.env.STUDENT_TOKEN,
        { expiresIn: '6h' });
    } catch (err) {
      const error = new HttpError('Logging in failed, please try again later', 500);
      return next(error);
    }

    res.json({ 
      userId: existingStudent.id,
      token: token,
      userType: 'student',
      message: "Logged In" });
};

const newStudent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return next(new HttpError("Invalid inputs passed", 422));
    }
  
    const { firstname, lastname, email, company } = req.body;
  
    let existingStudent;
  
    try {
      existingStudent = await Student.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("Could not create new student, please contact Joon", 500);
      console.log(err.message);
      return next(error);
    }
  
    if (existingStudent) {
      const error = new HttpError("Student exists already, please direct student to login", 422);
      return next(error);
    }
  
    const createdStudent = new Student({
      firstname,
      lastname,
      email,
      company
    });
  
    try {
      await createdStudent.save();
    } catch (err) {
      const error = new HttpError("Registration failed, please try again", 500);
      console.log(err.message);
      return next(error);
    }

    let token;

    try {
      token = jwt.sign(
        { userId: createdStudent.id, email: createdStudent.email, isAdmin: false },
        process.env.STUDENT_TOKEN,
        { expiresIn: '6h' });
    } catch (err) {
      const error = new HttpError('Signing up failed, please try again later', 500);
      console.log(err.message);
      return next(error)
    }
  
    res.status(201).json({ Student: createdStudent.toObject({ getters: true }), success: true });
  };

  const deleteStudent = async (req, res, next) => {
    const studentId = req.params.sid;
  
    try {
      const student = await Student.findById(studentId);
      if (!student) {
        return next(new HttpError("Could not find student for provided id.", 404));
      }
  
      await student.deleteOne();
  
      res.status(200).json({ message: "Deleted student." });
    } catch (err) {
      const error = new HttpError("Something went wrong, could not delete student.", 500);
      return next(error);
    }
  };
  
exports.login = login;
exports.getAllStudents = getAllStudents;
exports.newStudent = newStudent;
exports.deleteStudent = deleteStudent;