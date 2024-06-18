const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoPractice = require('./mongoose');

const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.post('/users', mongoPractice.createUser);

app.get('/users', mongoPractice.getUsers);

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/users?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000) 
        console.log("Connection Success");
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err);
    })