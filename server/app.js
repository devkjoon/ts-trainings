const express = require('express');
const bodyParser = require('body-parser');
const mongoPractice = require('./config/db');
const { mongo } = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.post('/users', mongoPractice.createUser);

app.get('/users', mongoPractice.getUsers);

app.listen(3000);