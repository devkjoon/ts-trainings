const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const Admin = require("../models/student");
const HttpError = require("../models/http-error");

const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching Admins failed, please try again later.', 500);
    console.log(err.message)
    return next(error);
  }
  res.json({admins: admins.map(admin => admin.toObject({ getters: true }))});
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
    const error = new HttpError(
      "Admin exists already, please login instead", 422);
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

  res.status(201).json({ Admin: createdAdmin.toObject({ getters: true }), success: true });
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

  res.json({ message: "Logged In" });
};


exports.getAdmin = getAdmins;
exports.signup = signup;
exports.login = login;
