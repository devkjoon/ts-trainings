const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    company: { type: String, required: true },
    loginCode: { type: String, required: true, unique: true, maxlength: 6, default: generateLoginCode },
    email: { type: String, required: true, unique: true }
});

studentSchema.pre('save', async function(next) {
    try {
        if (!this.loginCode) {
            this.loginCode = generateLoginCode();
        }
        next();
    } catch (error) {
        next(error);
    }
});

function generateLoginCode() {
    let loginCode = '';
    const digits = '0123456789';
    for (let i = 0; i < 6; i++) {
        loginCode += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return loginCode;
}

module.exports = mongoose.model('Student', studentSchema);
