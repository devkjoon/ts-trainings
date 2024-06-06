const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://devkjoon:0kF80GAuhfTc10yW@cluster0.7lsjeug.mongodb.net/users_test?retryWrites=true&w=majority&appName=Cluster0'

const createUser = async (req, res, next) => {
   const newUser = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
   };
   const client = new MongoClient(url);

   try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('users').insertOne(newUser);
   } catch (error) {
    return res.json({message: 'Could not store data'});
   };
   client.close();

   res.json(newUser);
};

const getUsers = async (req, res, next) => {
    const client = new MongoClient(url);

    let users;

    try {
        await client.connect();
        const db = client.db();
        users = await db.collection('users').find().toArray();
    } catch (err) {
        return res.json({message: 'Could not retrieve users'})
    };
    client.close();

    res.json(users);
};

exports.createUser = createUser;
exports.getUsers = getUsers;