const Course = require('../models/course');

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('modules');
        res.json({ courses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
};

const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('modules');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch course' });
    }
};

const createCourse = async (req, res) => {
    const { title, description } = req.body;
    try {
        const course = new Course({ title, description });
        await course.save();
        res.status(201).json({ course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create course' });
    }
};

exports.getAllCourses = getAllCourses;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
