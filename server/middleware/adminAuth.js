const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const adminAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token
    if (!token) {
      throw new Error('Authentication failed! No token provided.');
    }

    const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN);
    if (!decodedToken.isAdmin) {
      throw new Error('Not authorized as admin.');
    }
    // To check if decoded token matches the admin's token
    /* req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin,
    }; */
    console.log('Middleware userData:', req.userData); // Verify userData
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication Error:', err.message);
    const error = new HttpError(err.message || 'Authentication failed.', 401);
    return next(error);
  }
};

module.exports = adminAuth;