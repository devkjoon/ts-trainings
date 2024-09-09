const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const adminAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authentication failed! No token provided.');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      throw new Error('Authentication failed! Token format invalid.');
    }

    const token = parts[1];
    const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
    if (!decodedToken.isAdmin) {
      throw new Error('Not authorized as admin.');
    }
    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin,
    }; /* 
    console.log('Middleware userData:', req.userData); // Verify userData */
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication Error:', err.message);
    const error = new HttpError(err.message || 'Authentication failed.', 401);
    return next(error);
  }
};

module.exports = adminAuth;
