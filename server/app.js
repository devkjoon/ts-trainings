const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const HttpError = require('./models/http-error');
const adminRoutes = require('./routes/admin-routes');
const studentRoutes = require('./routes/student-routes');
const courseRoutes = require('./routes/course-routes');
const sectionRoutes = require('./routes/section-routes')
// const progressRoutes = require('./routes/progress-routes');

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/section', sectionRoutes);
// app.use('/progress', progressRoutes);
// app.use('/certificate', certificateRoutes);

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
    .connect(process.env.MONGODB_URI)
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
