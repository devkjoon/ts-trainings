const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const Admin = require("../models/admin");
const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
require('../middleware/adminAuth');

const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching Admins failed, please try again later.', 500);
    console.log(err.message);
    return next(error);
  }
  res.json({ admins: admins.map(admin => admin.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { firstname, lastname, email, username, password, adminCode } = req.body;

  const actualAdminCode = process.env.ADMIN_CODE;

  if (adminCode !== actualAdminCode) {
    const error = new HttpError('Invalid Admin Code', 403);
    return next(error);
  }

  let existingAdmin;

  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please contact support", 500);
    console.log(err.message);
    return next(error);
  }

  if (existingAdmin) {
    const error = new HttpError("Admin exists already, please login instead", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create admin, please try again', 500);
    console.log(err.message);
    return next(error);
  }

  const createdAdmin = new Admin({
    firstname,
    lastname,
    email,
    username,
    password: hashedPassword,
  });

  try {
    await createdAdmin.save();
  } catch (err) {
    const error = new HttpError("Registration failed, please try again", 500);
    console.log(err.message);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdAdmin.id, email: createdAdmin.email, isAdmin: true },
      process.env.ADMIN_TOKEN,
      { expiresIn: '6h' }
    );
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later', 500);
    console.log(err.message);
    return next(error);
  }

  res.status(201).json({ 
    admin: createdAdmin.toObject({ getters: true }), 
    token: token,
    success: true 
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Login failed, please contact support", 500);
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingAdmin.id, email: existingAdmin.email, isAdmin: true },
      process.env.ADMIN_TOKEN,
      { expiresIn: '6h' }
    );
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later', 500);
    return next(error);
  }

  res.json({ 
    userId: existingAdmin.id,
    email: existingAdmin.email,
    token: token,
    userType: 'admin',
    message: "Logged In" 
  });
};

const getProtectedResource = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userData.userId).select('-password');
    if (!admin) {
      console.error(`Admin not found for ID: ${req.userData.userId}`);
      throw new HttpError('Admin not found', 404);
    }
    // console.log('Admin data retrieved successfully');
    res.json({ admin: admin.toObject({ getters: true }) });
  } catch (err) {
    console.error('Error in getProtectedResource:', err.message, err.stack);  // Log the error stack trace
    const error = new HttpError('Fetching admin failed, please try again later', 500);
    return next(error);
  }
};



module.exports = {
  getAdmins,
  signup,
  login,
  getProtectedResource
};
