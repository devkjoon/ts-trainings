const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoPractice = require('./mongoose');

const adminRoutes = require('./routes/admin-routes');

const app = express();

app.use(bodyParser.json());

app.use('/admin', adminRoutes);

// app.post('/admin', mongoPractice.createAdmin);

// app.get('/admin', mongoPractice.getAdmin);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

mongoose
    .connect('mongodb+srv://devkjoon:0kF80GAuhfTc10yW@ts-trainings.ic7mcip.mongodb.net/admin?retryWrites=true&w=majority&appName=ts-trainings')
    .then(() => {
        app.listen(5000) 
        console.log("Connection Success");
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err);
    })