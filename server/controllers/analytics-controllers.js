const mongoose = require('mongoose');
const CourseAssignment = require('../models/courseAssignment');
const Course = require('../models/course');
const HttpError = require('../models/http-error');

const getCourseEnrollmentAndRevenueData = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await CourseAssignment.aggregate([
      {
        $match: {
          assignedAt: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$assignedAt" } },
            course: "$course",
            status: "$status"
          },
          enrollments: { $sum: 1 },
          revenue: { $sum: "$revenue" }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id.course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $project: {
          date: "$_id.date",
          courseName: "$courseInfo.title",
          status: "$_id.status",
          enrollments: 1,
          revenue: 1
        }
      },
      {
        $sort: { date: 1, courseName: 1 }
      }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    const error = new HttpError('Failed to fetch analytics data', 500);
    return next(error);
  }
};

const getCourseAnalytics = async (req, res, next) => {
  try {
    const courseAnalytics = await CourseAssignment.aggregate([
      {
        $group: {
          _id: '$course',
          enrolledCount: { $sum: 1 },
          completedCount: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] 
            } 
          },
          revenue: { $sum: '$revenue' }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $project: {
          _id: 0,
          courseId: '$_id',
          title: '$courseInfo.title',
          enrolledCount: 1,
          completedCount: 1,
          revenue: 1
        }
      }
    ]);

    const totalRevenue = courseAnalytics.reduce((sum, course) => sum + course.revenue, 0);
    const totalEnrolled = courseAnalytics.reduce((sum, course) => sum + course.enrolledCount, 0);
    const totalCompleted = courseAnalytics.reduce((sum, course) => sum + course.completedCount, 0);

    res.json({
      success: true,
      data: {
        courses: courseAnalytics,
        totalRevenue,
        totalEnrolled,
        totalCompleted
      }
    });

  } catch (err) {
    console.error('Error fetching course analytics:', err);
    const error = new HttpError('Failed to fetch course analytics', 500);
    return next(error);
  }
};

const getMonthlyRevenueData = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await CourseAssignment.aggregate([
      {
        $match: {
          assignedAt: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo'
        }
      },
      {
        $unwind: '$courseInfo'
      },
      {
        $group: {
          _id: {
            year: { $year: "$assignedAt" },
            month: { $month: "$assignedAt" },
            courseName: '$courseInfo.title'  // Changed from 'name' to 'title'
          },
          enrollments: { $sum: 1 },
          revenue: { $sum: "$revenue" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month"
                }
              }
            }
          },
          courseName: '$_id.courseName',
          enrollments: 1,
          revenue: 1
        }
      }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error fetching monthly enrollment and revenue data:', err);
    const error = new HttpError('Failed to fetch monthly enrollment and revenue data', 500);
    return next(error);
  }
};

module.exports = {
  getCourseEnrollmentAndRevenueData,
  getCourseAnalytics,
  getMonthlyRevenueData
};