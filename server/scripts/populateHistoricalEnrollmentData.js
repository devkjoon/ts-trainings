const dotenv = require('dotenv');
const mongoose = require('mongoose');
const CourseAssignment = require('../models/courseAssignment');
const Student = require('../models/student');
const Course = require('../models/course');
const Company = require('../models/company');

dotenv.config();

async function populateHistoricalEnrollmentData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);

    const students = await Student.find({}).populate('company');

    let totalStudents = 0;
    let totalCourses = 0;
    let existingAssignments = 0;
    let newAssignments = 0;

    for (const student of students) {
      totalStudents++;

      // Combine enrolled and completed courses
      const allCourses = [
        ...student.enrolledCourses,
        ...student.completedCourses.map((cc) => cc.courseId),
      ];

      for (const courseId of allCourses) {
        totalCourses++;

        // Check if a CourseAssignment already exists
        const existingAssignment = await CourseAssignment.findOne({
          student: student._id,
          course: courseId,
        });

        if (existingAssignment) {
          existingAssignments++;
        } else {
          // Fetch the full course details
          const fullCourse = await Course.findById(courseId);

          // Determine the status based on whether the course is in completedCourses
          const isCompleted = student.completedCourses.some(
            (cc) => cc.courseId.toString() === courseId.toString()
          );
          const status = isCompleted ? 'completed' : 'in_progress';

          // Create a new CourseAssignment
          const newAssignment = new CourseAssignment({
            student: student._id,
            course: courseId,
            company: student.company._id,
            assignedAt: new Date(), // You might want to use a more accurate date if available
            status: status,
            priceAtAssignment: fullCourse.price,
            revenue: fullCourse.price, // Adjust this if needed based on your business logic
          });

          try {
            await newAssignment.save();
            newAssignments++;
            console.log(
              `Created ${status} assignment for student ${student._id} and course ${courseId}`
            );
          } catch (err) {
            console.error(
              `Error creating assignment for student ${student._id} and course ${courseId}:`,
              err
            );
          }
        }
      }
    }

    console.log(`Processed ${totalStudents} students`);
    console.log(`Processed ${totalCourses} courses`);
    console.log(`Found ${existingAssignments} existing assignments`);
    console.log(`Created ${newAssignments} new assignments`);
    console.log('Historical enrollment data population complete');
  } catch (error) {
    console.error('Error populating historical enrollment data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

populateHistoricalEnrollmentData();
