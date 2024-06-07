const express = require('express');
const bodyParser = require('body-parser');
const mongoPractice = require('./mongoose');

const app = express();

app.use(bodyParser.json());

app.post('/users', mongoPractice.createUser);

app.get('/users', mongoPractice.getUsers);

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@cluster0.7lsjeug.mongodb.net/users_test?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err)
    })