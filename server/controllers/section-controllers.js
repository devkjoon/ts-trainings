const Section = require('../models/section');
const HttpError = require('../models/http-error');

const getSections = async (req, res, next) => {
  let sections;
  try {
    sections = await Section.find();
  } catch (err) {
    const error = new HttpError('Fetching sections failed, please try again later.', 500);
    return next(error);
  }
  res.json({ sections: sections.map(section => section.toObject({ getters: true })) });
};

const getSectionById = async (req, res, next) => {
  const sectionId = req.params.sid;
  let section;
  try {
    section = await Section.findById(sectionId);
  } catch (err) {
    const error = new HttpError('Fetching section failed, please try again later.', 500);
    return next(error);
  }
  if (!section) {
    const error = new HttpError('Section not found', 404);
    return next(error);
  }
  res.json({ section: section.toObject({ getters: true }) });
};

const createSection = async (req, res, next) => {
  const { title, description, resource, quiz } = req.body;

  const createdSection = new Section({
    title,
    description,
    resource,
    quiz
  });

  try {
    await createdSection.save();
  } catch (err) {
    const error = new HttpError('Creating section failed, please try again later.', 500);
    return next(error);
  }

  res.status(201).json({ section: createdSection });
};

const submitQuiz = async (req, res, next) => {
    const sectionId = req.params.sid;
    const { answers } = req.body;
  
    let section;
    try {
      section = await Section.findById(sectionId);
    } catch (err) {
      const error = new HttpError('Fetching section failed, please try again later.', 500);
      return next(error);
    }
  
    if (!section) {
      const error = new HttpError('Section not found', 404);
      return next(error);
    }
  
    const correctAnswers = section.quiz.questions.map(q => q.correctAnswer);
    const isCorrect = answers.every((answer, idx) => answer === correctAnswers[idx]);
  
    if (isCorrect) {
      res.status(200).json({ message: 'Quiz passed!', success: true });
    } else {
      res.status(200).json({ message: 'Quiz failed.', success: false });
    }
  };
  


module.exports = {
  getSections,
  getSectionById,
  createSection,
  submitQuiz
};
