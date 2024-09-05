const Admin = require('../models/admin');
const Student = require('../models/student');
const Course = require('../models/course');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utility/emailService');
const { resendCertificateEmail } = require('../utility/certificateEmailService');

const sendStudentLoginCode = async (req, res, next) => {
  const { studentId, email } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    if (student.email !== email) {
      return next(new HttpError('Email does not match student record', 400));
    }

    const subject = 'Your Login Code';
    const text =
      `Your login code is: ${student.loginCode}. \n\n` +
      `Please use this code to access your training portal.\n\n` +
      `If you did not request this, please ignore this email.\n`;

    await sendEmail(email, subject, text);

    res.json({ success: true, message: 'Login code sent successfully' });
  } catch (error) {
    console.error('Error sending login code:', error);
    return next(new HttpError('Failed to send login code', 500));
  }
};

const resendCertificate = async (req, res, next) => {
  const { studentId, courseId } = req.body;

  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return next(new HttpError('Student or course not found', 404));
    }

    const completedCourse = student.completedCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!completedCourse) {
      return next(new HttpError('Student has not completed this course', 400));
    }

    const sanitizedStudentName = `${student.firstname} ${student.lastname}`
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/ /g, '-');
    const sanitizedCourseName = course.title
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/ /g, '-');

    const filePath = `${sanitizedCourseName}/${sanitizedStudentName}.pdf`;

    await resendCertificateEmail(student.email, filePath, student, course);

    res.json({ success: true, message: 'Certificate resent successfully' });
  } catch (error) {
    console.error('Error resending certificate:', error);
    return next(new HttpError('Failed to resend certificate', 500));
  }
};

module.exports = {
  sendStudentLoginCode,
  resendCertificate,
};
