const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tsTraining', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection Success")
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err)
    })
    
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String
});
