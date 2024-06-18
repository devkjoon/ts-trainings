const express = require('express');
const bodyParser = require('body-parser');
const mongoPractice = require('./mongoose');

const app = express();

app.use(bodyParser.json());

app.post('/users', mongoPractice.createUser);

app.get('/users', mongoPractice.getUsers);

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/users?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err)
    })