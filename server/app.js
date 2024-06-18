const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/user', userRoutes);

app.use((req, res) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if (!res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred'});
});

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/training-module?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000) 
        console.log("Connection Success");
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err);
    })