const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const studentAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.STUDENT_TOKEN);
    if(!decodedToken.isAdmin) {
      req.userData = {
        userId: decodedToken.userId,
        email: decodedToken.email
      };
      next();
    } else {
      throw new Error('Not authorized as student');
    }    
  } catch (err) {
    const error = new HttpError("Authentication failed! Invalid token or not student", 401);
    return next(error);
  }
};

module.exports = studentAuth;