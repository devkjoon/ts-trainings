const Contractor = require('../models/contractor');
const HttpError = require('../models/http-error');

const getAllContractors = async (req, res, next) => {
    let contractors;
    try {
        contractors = await Contractor.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching contractors failed, please try again later',
            500
        );
        return next(error);
    }
    
    res.json({
        contractors: contractors.map((contractor) => contractor.toObject({ getters: true })),
    });
};

const newContractor = async (req, res, next) => {

    const { name, phoneNumber, address, contact } = req.body;

    let existingContractor;

    try {
        existingContractor = await Contractor.findOne({ name: name });
    } catch (err) {
        const error = new HttpError('Adding new contractor failed, please contact support', 500);
        console.log(err.message);
        return next(error);
    }

    if (existingContractor) {
        const error = new HttpError('Contractor already exists', 422);
        return next(error);
    }

    const createdContractor = new Contractor({
        name,
        phoneNumber,
        address,
        contact,
    });

    try {
        await createdContractor.save();
    } catch (err) {
        const error = new HttpError('Adding new contractor failed, please try again', 500);
        console.log(err.message);
        return next(error);
    }
}

module.exports = {
    getAllContractors,
    newContractor
}