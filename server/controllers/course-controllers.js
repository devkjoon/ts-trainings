const Course = require('../models/course');
const Student = require('../models/student');
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

const getCourseModules = async (req, res, next) => {
  const courseId = req.params.cid;
  const studentId = req.query.sid;

  try {
    // Fetch the course to get the moduleIconUrl
    const course = await Course.findById(courseId).populate('modules');
    if (!course) {
      return next(new HttpError('Course not found', 404));
    }

    // Fetch the student to get completed modules
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new HttpError('Student not found', 404));
    }

    // Identify completed modules
    const completedModules = student.completedModules.map(m => m.toString());

    // Prepare modules with iconUrl
    const modulesWithIcons = course.modules.map(module => ({
      ...module.toObject({ getters: true }),
      moduleIconUrl: course.moduleIconUrl,
      completed: completedModules.includes(module._id.toString())
    }));

    res.json({ modules: modulesWithIcons });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return next(new HttpError('Fetching modules failed, please try again later', 500));
  }
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
  getCourseModules,
  createCourse,
  deleteCourse
}