const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const HttpError = require('./models/http-error');
const adminRoutes = require('./routes/admin-routes');
const studentRoutes = require('./routes/student-routes');
const courseRoutes = require('./routes/course-routes');
const moduleRoutes = require('./routes/module-routes');
const companyRoutes = require('./routes/company-routes');

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/module', moduleRoutes);
app.use('/company', companyRoutes);
// app.use('/progress', progressRoutes);
// app.use('/certificate', certificateRoutes);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle requests to any route and send the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Server Error');
      }
    });
  });

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

const mongooseOptions = {
    tls: true,
    tlsAllowInvalidCertificates: false
};

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Connection Success');
        });
    })
    .catch(err => {
        console.log('Connection Failed');
        console.log(err);
    });
