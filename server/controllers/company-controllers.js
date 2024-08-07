const Company = require('../models/company');
const HttpError = require('../models/http-error');

const getAllCompanies = async (req, res, next) => {
    let companies;
    try {
        companies = await Company.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching companies failed, please try again later',
            500
        );
        return next(error);
    }
    
    res.json({
        companies: companies.map((company) => company.toObject({ getters: true })),
    });
};

const newCompany = async (req, res, next) => {

    const { name, phoneNumber, address, contact } = req.body;

    let existingCompany;

    try {
        existingCompany = await Company.findOne({ name: name });
    } catch (err) {
        const error = new HttpError('Adding new company failed, please contact support', 500);
        console.log(err.message);
        return next(error);
    }

    if (existingCompany) {
        const error = new HttpError('Company already exists', 422);
        return next(error);
    }

    const createdCompany = new Company({
        name,
        phoneNumber,
        address,
        contact,
    });

    try {
    await createdCompany.save();
    res.status(201).json({ success: true, message: 'New company added successfully', company: createdCompany }); // Add company object in response
  } catch (err) {
    const error = new HttpError('Adding new company failed, please try again', 500);
    console.log(err.message);
    return next(error);
  }
}

module.exports = {
    getAllCompanies,
    newCompany
}