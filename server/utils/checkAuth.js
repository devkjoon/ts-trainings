const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
   
    
    if (!req.userData) {
        const error = new HttpError('Unauthorized - User not authenticated', 401);
        return next (error);
    }
    next();
}

module.exports = checkAuth;