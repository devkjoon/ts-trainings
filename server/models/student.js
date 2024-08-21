const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    loginCode: { type: String, required: true, unique: true, maxlength: 6, default: generateLoginCode },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
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
