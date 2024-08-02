const Module = require('../models/module');
const Student = require('../models/student');
const HttpError = require('../models/http-error');

const getModules = async (req, res, next) => {
  let modules;
  try {
    modules = await Module.find();
  } catch (err) {
    const error = new HttpError('Fetching modules failed, please try again later here.', 500);
    return next(error);
  }
  res.json({ modules: modules.map(module => module.toObject({ getters: true })) });
};

const getModuleById = async (req, res, next) => {
  const moduleId = req.params.mid;
  let module;
  try {
    module = await Module.findById(moduleId);
  } catch (err) {
    const error = new HttpError('Fetching module failed, please try again later.', 500);
    return next(error);
  }
  if (!module) {
    const error = new HttpError('Module not found', 404);
    return next(error);
  }
  res.json({ module: module.toObject({ getters: true }) });
};

const createModule = async (req, res, next) => {
  const { title, description, resource, quiz } = req.body;

  const createdModule = new Module({
    title,
    description,
    resource,
    quiz
  });

  try {
    await createdModule.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Creating module failed, please try again later. erere', 500);
    return next(error);
  }

  res.status(201).json({ module: createdModule });
};

const submitQuiz = async (req, res, next) => {
    const moduleId = req.params.mid;
    const { answers, studentId } = req.body;
  
    let module;
    try {
      module = await Module.findById(moduleId);
    } catch (err) {
      const error = new HttpError('Fetching module failed, please try again later.', 500);
      return next(error);
    }
  
    if (!module) {
      const error = new HttpError('Module not found', 404);
      return next(error);
    }
  
    const correctAnswers = module.quiz.questions.map(q => q.correctAnswer);
    const correctCount = answers.reduce((count, answer, idx) => count + (answer === correctAnswers[idx] ? 1 : 0), 0);
    const passingScore = Math.ceil(module.quiz.questions.length * 0.7); // Example 70% passing threshold
    const passed = correctCount >= passingScore;

    if (passed) {
      try {
        const student = await Student.findById(studentId);
        if (!student) {
          const error = new HttpError('Student not found', 404);
          console.log(error.message);
          return next(error);
        }
        if (!student.completedModules.includes(moduleId)) {
          student.completedModules.push(moduleId);
          await student.save();
        }
      } catch (err) {
        const error = new HttpError('Saving progress failed, please try again later', 500);
        return next(error);
      }
    }
  
    res.status(200).json({
      message: passed ? 'Quiz passed!' : 'You need at least a 70% to complete this module',
      success: passed,
    });
  };
  


module.exports = {
  getModules,
  getModuleById,
  createModule,
  submitQuiz
};
