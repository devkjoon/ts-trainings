const mongoose = require('mongoose');

const User = require('./models/user');

mongoose.connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@cluster0.7lsjeug.mongodb.net/users_test?retryWrites=true&w=majority&appName=Cluster0').then(() => {
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
    const result = await createdUser.save();
    console.log(typeof createUser.id);
    res.json(result);
};

const getUsers = async (req, res, next) => {
    const users = await User.find().exec();
    res.json(users);
}

exports.createUser = createUser;
exports.getUsers = getUsers;
