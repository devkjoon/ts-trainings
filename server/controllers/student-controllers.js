const { validationResult } = require("express-validator");
const Student = require("../models/student");
const HttpError = require("../models/http-error");

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

    res.json({ message: "Logged In" });
};

exports.login = login;