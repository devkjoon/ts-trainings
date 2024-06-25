const UserProgress = require('../models/userProgress');

const getAllUserProgress = async (req, res) => {
  try {
    const userProgress = await UserProgress.find();
    res.json({ userProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};

const getUserProgressByUserAndCourse = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await UserProgress.findOne({ user: userId, course: courseId });
    if (!progress) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    res.json({ progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user progress' });
  }
};

const createUserProgress = async (req, res) => {
  const { user, course } = req.body;
  try {
    const newProgress = new UserProgress({ user, course });
    await newProgress.save();
    res.status(201).json({ progress: newProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user progress' });
  }
};

const updateUserProgress = async (req, res) => {
  const { id } = req.params;
  const { moduleProgress, completed } = req.body;
  try {
    const updatedProgress = await UserProgress.findByIdAndUpdate(id, { moduleProgress, completed }, { new: true });
    if (!updatedProgress) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    res.json({ progress: updatedProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user progress' });
  }
};

module.exports = {
  getAllUserProgress,
  getUserProgressByUserAndCourse,
  createUserProgress,
  updateUserProgress,
};
