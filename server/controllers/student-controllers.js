const Student = require("../models/student");
const Course = require("../models/course");
const Module = require('../models/module');
const CourseAssignment = require("../models/courseAssignment");
const Company = require('../models/company');

const { validationResult } = require("express-validator");
const { sendEmail } = require('../utility/emailService');
const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
require('../middleware/studentAuth');

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

const requestLoginCode = async (req, res, next) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(new HttpError('No student with that email address exists', 404));
    }

    const loginCode = student.loginCode;

    const subject = 'Your Login Code';
    const message = `Dear ${student.firstname}, \n\n` +
    `Your login code is: ${loginCode}\n\n` +
    `Please use this code to log in to your account. \n\n` +
    `If you did not request this, please ignore this email.\n`;

    await sendEmail(student.email, subject, message);

    res.status(200).json({ message: `A login code has been sent to the provided email address.` });
  } catch (err) {
    return next(new HttpError('Error sending login code, please try again later.', 500));
  }
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
    await createdStudent.populate('company');
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

const updateStudent = async (req, res, next) => {
  const { sid } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data', 422));
  }

  const { firstname, lastname, email, company } = req.body;

  try {
    let student = await Student.findById(sid);
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    student.firstname = firstname;
    student.lastname = lastname;
    student.email = email;
    student.company = company;

    await student.save();

    // Re-fetch the student and populate the company field before returning it
    student = await Student.findById(sid)
      .populate('company', 'name');

    res.status(200).json({ student: student.toObject({ getters: true }), success: true });
  } catch (err) {
    console.error('Error updating student:', err);
    const error = new HttpError('Something went wrong, could not update student.', 500);
    return next(error);
  }
};

const assignCourse = async (req, res, next) => {
  const studentId = req.params.sid; 
  const { courseId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError('Course not found', 404));
    }

    // Check if the student is already enrolled in the course
    if (student.enrolledCourses.includes(courseId)) {
      return next(new HttpError('Student is already enrolled in this course', 400));
    }

    // Create a new CourseAssignment
    const newAssignment = new CourseAssignment({
      student: studentId,
      course: courseId,
      company: student.company,
      assignedAt: new Date(),
      revenue: course.price,
    });

    await newAssignment.save();

    // Add the course to the student's enrolledCourses
    student.enrolledCourses.push(courseId);
    await student.save();

    res.status(201).json({ message: 'Course assigned successfully', assignment: newAssignment, success: true });
  } catch (err) {
    console.error('Error in assignCourse:', err);
    return next(new HttpError(`Assigning course failed: ${err.message}`, 500));
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({}, "-password")
      .populate({
        path: 'enrolledCourses',
        select: 'title modules'
      })
      .populate({
        path: 'company',
        select: 'name'
      })
      .select('firstname lastname email company completedModules enrolledCourses')
      .lean();

    const updatedStudents = await Promise.all(students.map(async (student) => {
      const progressData = await Promise.all(student.enrolledCourses.map(async (course) => {
        const modules = await Module.find({ _id: { $in: course.modules } }).select('_id');

        const completedModulesCount = modules.filter(module =>
          student.completedModules.some(completedModuleId => 
            String(completedModuleId) === String(module._id)
          )
        ).length;

        const totalModulesCount = modules.length;
        const progress = totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0;

        return {
          courseId: course._id,
          courseName: course.title,
          progress
        };
      }));

      return { ...student, courseProgress: progressData };
    }));

    res.json({ students: updatedStudents });
  } catch (err) {
    console.error('Error fetching students:', err);
    const error = new HttpError("Fetching students failed, please try again later.", 500);
    return next(error);
  }
};

const getStudentCourses = async (req, res, next) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId)
    .populate('enrolledCourses')
    .populate('completedCourses.courseId');

    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    const enrolledCourses = student.enrolledCourses.filter(course => 
      !student.completedCourses.some(completed => 
        completed.courseId.toString() === course._id.toString()
      )
    );

    const completedCourses = student.completedCourses.map(completed => ({
      ...completed.courseId.toObject({ getters: true })
    }));

    res.json({
      enrolledCourses: enrolledCourses.map(course => course.toObject({ getters: true })),
      completedCourses: completedCourses
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

module.exports = {
  login,
  requestLoginCode,
  newStudent,
  deleteStudent,
  updateStudent,
  assignCourse,
  getAllStudents,
  getStudentCourses,
  getCompletedModules,
}