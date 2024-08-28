const mongoose = require('mongoose');
const Module = require('../models/module');
const Student = require('../models/student');
const Course = require('../models/course');

const HttpError = require('../models/http-error');
const { generateCertificate, sendCertificateEmail } = require('../utility/certificateEmailService');

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
  const { title, description, order, resource, optionalResource, quiz, isFinalTest } = req.body;

  const createdModule = new Module({
    title,
    description,
    order,
    resource,
    optionalResource,
    quiz,
    isFinalTest
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

  try {
    const module = await Module.findById(moduleId);
    if (!module) return next(new HttpError('Module not found', 404));

    const correctAnswers = module.quiz.questions.map(q => q.correctAnswer);
    const correctCount = answers.reduce((count, answer, idx) => count + (answer === correctAnswers[idx] ? 1 : 0), 0);
    const passingScore = Math.ceil(module.quiz.questions.length * 0.7);
    const passed = correctCount >= passingScore;

    if (passed) {
      const student = await Student.findById(studentId);
      if (!student) return next(new HttpError('Student not found', 404));

      if (!student.completedModules.includes(moduleId)) {
        student.completedModules.push(moduleId);
        await student.save();
      }

      if (module.isFinalTest) {
        const allCourses = await Course.find({});
        const course = allCourses.find(c => c.modules.some(m => m.toString() === moduleId));

        if (!course) {
          console.error(`Course with module ID ${moduleId} not found`);
          return next(new HttpError('Course associated with this module not found.', 404));
        }

        const certificationNumber = 'TS-' + Date.now();
        const studentName = `${student.firstname} ${student.lastname}`;
        const certificatePath = await generateCertificate(studentName, course.title, course.details, certificationNumber);

        await sendCertificateEmail(student.email, certificatePath, student, course);
      }
    }

    res.status(200).json({
      message: passed ? 'Quiz passed!' : 'You need at least a 70% to complete this module',
      success: passed,
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError('An error occurred, please try again later.', 500));
  }
};

module.exports = {
  getModules,
  getModuleById,
  createModule,
  submitQuiz
};
