const mongoose = require('mongoose');

const User = require('./models/user');

mongoose.connect('mongodb+srv://devkjoon:0k80GAuhfTc10yW@testing.gn70qfv.mongodb.net/?retryWrites=true&w=majority&appName=Testing').then(() => {
    console.log('Connected to database')
}).catch(() => {
    console.log('Connection failed')
})

const createUser = async (req, res, next) => {
    const createdUser = new User({ 
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });
};

exports.createUser = createUser;
