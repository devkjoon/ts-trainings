const Company = require('../models/company');

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const getAllCompanies = async (req, res, next) => {
  let companies;
  try {
    companies = await Company.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching companies failed, please try again later', 500);
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
    res
      .status(201)
      .json({ success: true, message: 'New company added successfully', company: createdCompany }); // Add company object in response
  } catch (err) {
    const error = new HttpError('Adding new company failed, please try again', 500);
    console.log(err.message);
    return next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  const companyId = req.params.cid;

  if (!req.userData || !req.userData.isAdmin) {
    console.log('Unauthorized Access Attempt:', req.userData);
    const error = new HttpError('Unauthorized: Admin privileges required', 403);
    return next(error);
  }

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new HttpError('Could not find company for provided id.', 404));
    }
    await company.deleteOne();
    res.status(200).json({ message: 'Deleted company.' });
  } catch (err) {
    const error = new HttpError('Something went wrong. Could not delete company.', 500);
    return next(error);
  }
};

const updateCompany = async (req, res, next) => {
  const companyId = req.params.cid;
  const { name, phoneNumber, address, contact } = req.body;

  let company;
  try {
    company = await Company.findById(companyId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update company.', 500);
    return next(error);
  }

  if (!company) {
    const error = new HttpError('Could not find company for provided id.', 404);
    return next(error);
  }

  company.name = name;
  company.phoneNumber = phoneNumber;
  company.address = address;
  company.contact = contact;

  try {
    await company.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update company.', 500);
    return next(error);
  }

  res.status(200).json({ success: true, company: company.toObject({ getters: true }) });
};

module.exports = {
  getAllCompanies,
  newCompany,
  deleteCompany,
  updateCompany,
};
