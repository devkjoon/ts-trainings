// controllers/question-controllers.js
const Question = require('../models/question');
const HttpError = require('../models/http-error');

const createQuestion = async (req, res, next) => {
  const { content, options, correctOptionIndex } = req.body;

  const createdQuestion = new Question({
    content,
    options,
    correctOptionIndex,
  });

  try {
    await createdQuestion.save();
  } catch (err) {
    const error = new HttpError('Creating question failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ question: createdQuestion.toObject({ getters: true }) });
};

const getAllQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    const error = new HttpError('Fetching questions failed, please try again later.', 500);
    return next(error);
  }

  res.json({ questions: questions.map((question) => question.toObject({ getters: true })) });
};

const getQuestionById = async (req, res, next) => {
  const questionId = req.params.qid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError('Fetching question failed, please try again later.', 500);
    return next(error);
  }

  if (!question) {
    const error = new HttpError('Could not find a question for the provided id.', 404);
    return next(error);
  }

  res.json({ question: question.toObject({ getters: true }) });
};

const updateQuestion = async (req, res, next) => {
  const { content, options, correctOptionIndex } = req.body;
  const questionId = req.params.qid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update question.', 500);
    return next(error);
  }

  question.content = content;
  question.options = options;
  question.correctOptionIndex = correctOptionIndex;

  try {
    await question.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update question.', 500);
    return next(error);
  }

  res.status(200).json({ question: question.toObject({ getters: true }) });
};

const deleteQuestion = async (req, res, next) => {
  const questionId = req.params.qid;

  let question;
  try {
    question = await Question.findById(questionId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete question.', 500);
    return next(error);
  }

  if (!question) {
    const error = new HttpError('Could not find question for this id.', 404);
    return next(error);
  }

  try {
    await question.remove();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete question.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Deleted question.' });
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
