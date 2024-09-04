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
const certificationRoutes = require('./routes/certification-routes');
const analyticsRoutes = require('./routes/analytics-routes');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://ts-trainings.com',
  'http://www.ts-trainings.com',
  'https://ts-trainings.com',
  'https://www.ts-trainings.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
app.use('/certification', certificationRoutes);
app.use('/analytics', analyticsRoutes);
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
