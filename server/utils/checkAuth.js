const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
   if (req.method === 'OPTIONS') {
    return next();
   };

   try {
    const token = req.headers.authroization.split(' ')[1];
    if (!token) {
        throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'your_jwt_secret_key');
    req.userData = { userId: decodedToken.userId, userType: decodedToken.userType };
    next();
   } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
   }
}

module.exports = checkAuth;