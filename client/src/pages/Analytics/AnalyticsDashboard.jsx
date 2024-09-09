import React from 'react';
import CourseEnrollmentChart from '../../components/Analytics/CourseEnrollmentChart';
import CourseAnalyticsChart from '../../components/Analytics/CourseAnalyticsChart';
import MonthlyRevenueChart from '../../components/Analytics/MonthlyRevenueChart';

import '../../assets/css/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  return (
    <div className="analytics-dashboard">
      <h1 className="page-title">Analytics Dashboard</h1>

      <div className="dashboard-section">
        <h2>Course Enrollment Over Time</h2>
        <CourseEnrollmentChart />
      </div>

      <div className="dashboard-section">
        <h2>Course Analytics Summary</h2>
        <CourseAnalyticsChart />
      </div>

      <div className="dashboard-section">
        <h2>Monthly Revenue</h2>
        <MonthlyRevenueChart />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
