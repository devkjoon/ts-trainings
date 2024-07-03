const Contractor = require('../models/contractor');
const HttpError = require('../models/http-error');

const getAllContractors = async (req, res, next) => {
    let contractors;
    try {
        contractors = await Contractor.find({}, '');
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

exports.getAllContractors = getAllContractors;