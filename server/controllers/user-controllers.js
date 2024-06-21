const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const HttpError = require("../models/http-error");
const AdminCode = require('../models/adminCode');
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { firstname, lastname, email, username, password, adminCode } = req.body;

  let existingAdminCode;

  try {
    existingAdminCode = await AdminCode.fineOne({ code: adminCode });
  } catch (err) {
    const error = new HttpError('Admin code verification failed, please try again later', 500);
    return next(error);
  }

  if (!existingAdminCode) {
    const error = new HttpError('Invalid admin code', 403);
    return next(error);
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please contact support", 500);
    console.log(err.message);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Admin exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    username,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Registration failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Login failed, please contact support", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  console.log('Input password:', password);
  console.log('Stored password:', existingUser.password);

  if (existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({ message: "Logged In" });
};


exports.getUser = getUsers;
exports.signup = signup;
exports.login = login;
