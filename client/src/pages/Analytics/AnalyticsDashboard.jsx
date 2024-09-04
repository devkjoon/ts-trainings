import React from 'react';
import CourseEnrollmentChart from '../../components/Analytics/CourseEnrollmentChart';
import CourseAnalytics from '../../components/Analytics/CourseAnalytics';
import MonthlyRevenueChart from '../../components/Analytics/MonthlyRevenueChart';

import '../../assets/css/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard</h1>
      
      <div className="dashboard-section">
        <h2>Course Enrollment Over Time</h2>
        <CourseEnrollmentChart />
      </div>
      
      <div className="dashboard-section">
        <h2>Course Analytics Summary</h2>
        <CourseAnalytics />
      </div>

      <div className="dashboard-section">
        <h2>Monthly Enrollment and Revenue</h2>
        <MonthlyRevenueChart />
      </div>
      
    </div>
  );
};

export default AnalyticsDashboard;