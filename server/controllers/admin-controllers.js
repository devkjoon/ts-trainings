const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utility/emailService');

const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({}, '-password');
    res.json({ admins: admins.map((admin) => admin.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError('Fetching Admins failed, please try again later.', 500));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed', 422));
  }

  const { firstname, lastname, email, username, password, adminCode } = req.body;

  if (adminCode !== process.env.ADMIN_CODE) {
    return next(new HttpError('Invalid Admin Code', 403));
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new HttpError('Admin exists already, please login instead', 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdAdmin = new Admin({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
    });

    await createdAdmin.save();

    const token = jwt.sign(
      { userId: createdAdmin.id, email: createdAdmin.email, isAdmin: true },
      process.env.ADMIN_TOKEN,
      { expiresIn: '6h' }
    );

    res.status(201).json({
      admin: createdAdmin.toObject({ getters: true }),
      token,
      success: true,
    });
  } catch (err) {
    return next(new HttpError('Signup failed, please try again later', 500));
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin || !(await bcrypt.compare(password, existingAdmin.password))) {
      return next(new HttpError('Invalid credentials, could not log you in.', 401));
    }

    const token = jwt.sign(
      { userId: existingAdmin.id, email: existingAdmin.email, isAdmin: true },
      process.env.ADMIN_TOKEN,
      { expiresIn: '6h' }
    );

    res.json({
      userId: existingAdmin.id,
      email: existingAdmin.email,
      token,
      userType: 'admin',
      message: 'Logged In',
    });
  } catch (err) {
    return next(new HttpError('Login failed, please try again later', 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return next(new HttpError('No account with that email address exists.', 404));
    }

    admin.generatePasswordReset();
    await admin.save();

    const resetLink = `http://ts-trainings.com/admin/reset-password/${admin.resetPasswordToken}`;
    const subject = 'Password Reset Request';
    const message = `
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      ${resetLink}
      <br></br>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `

    await sendEmail(admin.email, subject, message);

    res
      .status(200)
      .json({
        message: 'An email has been sent to the provided email address with further instructions.',
      });
  } catch (err) {
    return next(new HttpError('Error sending reset email, please try again later.', 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
    const admin = await Admin.findById(decodedToken.userId);

    if (!admin || admin.resetPasswordToken !== token || admin.resetPasswordExpires < Date.now()) {
      return next(new HttpError('Token is invalid or has expired.', 403));
    }

    admin.password = await bcrypt.hash(password, 12);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    return next(new HttpError('Token is invalid or has expired.', 403));
  }
};

const getProtectedResource = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userData.userId).select('-password');
    if (!admin) {
      return next(new HttpError('Admin not found', 404));
    }
    res.json({ admin: admin.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError('Fetching admin failed, please try again later', 500));
  }
};

module.exports = {
  getAdmins,
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProtectedResource,
};
