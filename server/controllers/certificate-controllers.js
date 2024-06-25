const Certificate = require('../models/certificate');

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json({ certificates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
};

const getCertificateById = async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch certificate' });
  }
};

const createCertificate = async (req, res) => {
  const { title, userId, courseId } = req.body;
  try {
    const newCertificate = new Certificate({ title, user: userId, course: courseId });
    await newCertificate.save();
    res.status(201).json({ certificate: newCertificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create certificate' });
  }
};

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
};
