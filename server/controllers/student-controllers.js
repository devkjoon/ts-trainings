const Student = require("../models/student");
const Course = require("../models/course");
const Module = require('../models/module');

const { validationResult } = require("express-validator");
const { sendEmail } = require('../utility/emailService');
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
      { expiresIn: '6h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later', 500);
    console.log(err.message);
    return next(error);
  }

  // Return response immediately after creation
  res.status(201).json({ student: createdStudent.toObject({ getters: true }), success: true });

  // Send email asynchronously after responding
  try {
    const subject = 'Student Account Login Code';
    const text = `Hello ${firstname},\n\nYour student account has been created.\nYour login code is ${createdStudent.loginCode}.\nYou may use your login credentials at https://ts-trainings.com\n\nThank you!`;
    await sendEmail(email, subject, text);
    console.log('Email sent to the student:', email);
  } catch (err) {
    console.error('Error sending email:', err.message);
    return res.status(500).json({ message: 'Student created but email could not be sent', success: false });
  }
};


const getStudentCourses = async (req, res, next) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('enrolledCourses');
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    res.json({
      courses: student.enrolledCourses.map(course => course.toObject({ getters: true }))
    });
  } catch (error) {
    return next(new HttpError('Fetching student courses failed', 500));
  }
}

const getCompletedModules = async (req, res, next) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('completedModules', 'title description');
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    res.status(200).json({ completedModules: student.completedModules });
  } catch (err) {
    console.error('Error fetching completed modules:', err);
    const error = new HttpError('Fetching completed modules failed, please try again later.', 500);
    return next(error);
  }
};

const assignCourse = async (req, res, next) => {
  const { sid } = req.params;
  const { courseId } = req.body;

  let student;
  try {
    student = await Student.findById(sid);
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    if (!student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      await student.save();
    }

    res.status(200).json({ message: 'Course assigned successfully' });
  } catch (err) {
    const error = new HttpError('Failed to assign course', 500);
    return next(error);
  }
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

const getStudentCourseProgress = async (req, res, next) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('enrolledCourses');
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    const progressData = await Promise.all(student.enrolledCourses.map(async (course) => {
      // Fetch modules by filtering based on courseId
      const modules = await Module.find({ _id: { $in: course.modules } });

      const completedModulesCount = modules.filter(module => student.completedModules.includes(module._id)).length;
      const totalModulesCount = modules.length;
      const progress = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;

      return {
        courseId: course._id,
        courseName: course.title,
        progress
      };
    }));

    res.json({ courses: progressData });
  } catch (err) {
    console.error('Error fetching course progress:', err);
    const error = new HttpError('Fetching course progress failed, please try again later.', 500);
    return next(error);
  }
};


module.exports = {
  login,
  getAllStudents,
  newStudent,
  getStudentCourses,
  assignCourse,
  deleteStudent,
  getCompletedModules,
  getStudentCourseProgress
}