// const homepage = (req, res, next) => {
//     console.log("GET Request in Places");
//     res.json({ message: 'Working' });
// };

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "ul",
    firstname: "Joon",
    lastname: "Kim",
    email: "joonkidk@gmail.com",
    username: "joonkidk",
    password: "test1234",
  },
];

const getUser = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { firstname, lastname, email, username, password } = req.body;

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
    password /* ,
        confirmationCode  */,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating Admin failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify credentials", 401);
  }

  res.json({ message: "Logged In" });
};

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;
