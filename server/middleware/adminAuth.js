const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const adminAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};

module.exports = adminAuth;
