const User = require('./models/user');

const createUser = async (req, res, next) => {
    const createdUser = new User({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
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
