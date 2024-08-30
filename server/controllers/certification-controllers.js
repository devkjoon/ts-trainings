const mongoose = require('mongoose');
const Certification = require('../models/certification');

const HttpError = require('../models/http-error');

const verifyCertification = async (req, res, next) => {
    const { certificationNumber } = req.query;

    try {
        const certification = await Certification.findOne({ certificationNumber });

        if (!certification) {
            return res.status(404).json({ message: 'Certification not found or invalid.' });
        }

        res.status(200).json({
            studentName: certification.studentName,
            courseName: certification.courseName,
            completionDate: certification.completionDate,
        });
    } catch (error) {
        return next(new HttpError('An error occurred while verifying the certification. Please try again later.', 500));
    }
};

module.exports = {
    verifyCertification
};