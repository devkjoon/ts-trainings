const Course = require('../models/course');
const HttpError = require('../models/http-error');

const getCourses = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find().populate('sections');
  } catch (err) {
    const error = new HttpError('Fetching courses failed, please try again later', 500);
    return next(error);
  }
  res.json({ courses: courses.map(course => course.toObject({ getters: true })) });
};

const getCourseById = async (req, res, next) => {
  const courseId = req.params.cid;
  let course;
  try {
    course = await Course.findById(courseId).populate('sections');
  } catch (err) {
    const error = new HttpError('Fetching course failed, please try again later', 500);
    return next(error);
  }
  if (!course) {
    const error = new HttpError('Course not found', 404);
    return next(error);
  }
  res.json({ course: course.toObject({ getters: true }) });
};

const createCourse = async (req, res, next) => {
  const { title, description, sections } = req.body;

  const createdCourse = new Course({
    title,
    description,
    sections
  });

  try {
    await createCourse.save();
  } catch (err) {
    const error = new HttpError('Creating course failed, please try again later', 500);
    return next(error);
  }

  res.status(201).json({ course: createdCourse });
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse
}