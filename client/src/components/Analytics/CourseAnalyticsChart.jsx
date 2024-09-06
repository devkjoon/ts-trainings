import React, { useState, useEffect } from 'react';

import API_URL from '../../config';

const CourseAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/course-analytics`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalyticsData(data.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  if (!analyticsData) return <div>Loading...</div>;

  return (
    <div className="course-analytics">
      <div className="total-stats">
        <div className="stat-item">
          <h3>Total Revenue</h3>
          <p>${analyticsData.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-item">
          <h3>Total Enrolled</h3>
          <p>{analyticsData.totalEnrolled}</p>
        </div>
        <div className="stat-item">
          <h3>Total Completed</h3>
          <p>{analyticsData.totalCompleted}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Enrolled</th>
            <th>Completed</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {analyticsData.courses.map((course) => (
            <tr key={course.courseId}>
              <td>{course.title}</td>
              <td>{course.enrolledCount}</td>
              <td>{course.completedCount}</td>
              <td>${course.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseAnalytics;
