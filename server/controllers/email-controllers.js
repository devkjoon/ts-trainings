const Admin = require('../models/admin');
const Student = require('../models/student');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utility/emailService');

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
    const text = `Your login code is: ${student.loginCode}. \n\n` +
    `Please use this code to access your training portal.\n\n` +
    `If you did not request this, please ignore this email.\n`;

    await sendEmail(email, subject, text);

    res.json({ success: true, message: 'Login code sent successfully' });
  } catch (error) {
    console.error('Error sending login code:', error);
    return next(new HttpError('Failed to send login code', 500));
  }
};

module.exports = {
  sendStudentLoginCode
}