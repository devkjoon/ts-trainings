const Question = require('../models/question');

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
};

const createQuestion = async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  try {
    const newQuestion = new Question({ question, options, correctAnswer });
    await newQuestion.save();
    res.status(201).json({ question: newQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create question' });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
};
