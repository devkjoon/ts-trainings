const Course = require('../models/course');
const HttpError = require('../models/http-error');

const getCourses = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find().populate('modules');
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
    course = await Course.findById(courseId).populate('modules');
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
  const { title, description, imageUrl, modules } = req.body;

  const createdCourse = new Course({
    title,
    description,
    imageUrl,
    modules
  });

  try {
    await createdCourse.save();
  } catch (err) {
    const error = new HttpError('Creating course failed, please try again later', 500);
    console.log(err)
    return next(error);
  }

  res.status(201).json({ course: createdCourse });
};

const deleteCourse = async (req, res, next) => {
  const courseId = req.params.cid;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HttpError("Could not find course for provided id.", 404));
    }

    await course.deleteOne();

    res.status(200).json({ message: "Deleted course." });
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete course.", 500);
    return next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse
}