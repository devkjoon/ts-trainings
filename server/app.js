const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET ,POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}

console.log(import.meta.env.VITE_ADMIN_CODE);

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    next(error);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/user?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
            console.log('Connection Success');
        });
    })
    .catch(err => {
        console.log('Connection Failed');
        console.log(err);
    });
