const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const adminAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authentication failed! No Authorization header.");
    }

    const token = authHeader.split(" ")[1]; // Expect format: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed! No token provided.");
    }

    const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
    if (decodedToken.isAdmin) {
      req.userData = {
        userId: decodedToken.userId,
        email: decodedToken.email,
      };
      next();
    } else {
      throw new Error("Not authorized as admin");
    }
  } catch (err) {
    console.error("Authentication Error:", err.message);
    const error = new HttpError(
      "Authentication failed. Invalid token or not admin",
      401
    );
    return next(error);
  }
};

module.exports = adminAuth;
