// const homepage = (req, res, next) => {
//     console.log("GET Request in Places");
//     res.json({ message: 'Working' });
// };

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'ul',
        firstname: 'Joon',
        lastname: 'Kim',
        email: 'joonkidk@gmail.com',
        username: 'joonkidk',
        password: 'test1234'
    }
];

const getAdmin = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
}

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed', 422);
    }

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('Email already exists', 402);
    }

    const createdAdmin = {
        id: uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdAdmin);

    res.status(201).json({user: createdAdmin});
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find( u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify credentials', 401);
    }
    
    res.json({ message: "Logged In" })
}

exports.getAdmin = getAdmin;
exports.signup = signup;
exports.login = login;