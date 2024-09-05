const Student = require('../models/student');
const Course = require('../models/course');
const HttpError = require('../models/http-error');
const { sendEmail } = require('../utility/emailService');
const { resendCertificateEmail } = require('../utility/certificateEmailService');

const sendLoginCode = async (req, res, next) => {
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
    const content = `
      <p>Your login code is: ${student.loginCode}.</p>
      <p>Please use this code to access your training portal.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(email, subject, content);

    res.json({ success: true, message: 'Login code sent successfully' });
  } catch (error) {
    console.error('Error sending login code:', error);
    return next(new HttpError('Failed to send login code', 500));
  }
};

const forgotLoginCode = async (req, res, next) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return next(new HttpError('No student with that email address exists', 404));
    }

    const subject = 'Your Login Code';
    const content = `
    <p>Dear ${student.firstname},</p>
    <p>Your login code is: ${student.loginCode}.</p>
    <p>Please use this code to access your training portal.</p>
    <p>If you did not request this, please ignore this email.</p>
    `;
    await sendEmail(student.email, subject, content);

    res.status(200).json({ message: `A login code has been sent to the provided email address.` });
  } catch (err) {
    return next(new HttpError('Error sending login code, please try again later.', 500));
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
  sendLoginCode,
  forgotLoginCode,
  resendCertificate,
};
