const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoPractice = require('./mongoose');

const userRoutes = require('./routes/user-routes');

const app = express();

app.use(bodyParser.json());

app.use('/user', userRoutes);

// app.post('/admin', mongoPractice.createAdmin);

// app.get('/admin', mongoPractice.getAdmin);

app.use((req, res) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/user?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000) 
        console.log("Connection Success");
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err);
    })