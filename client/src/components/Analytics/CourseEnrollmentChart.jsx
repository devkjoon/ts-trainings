import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import API_URL from '../../config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CourseEnrollmentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [viewMode, setViewMode] = useState('daily');

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchData = async () => {
    try {
      const url = new URL(`${API_URL}/analytics/course-enrollment-revenue`, window.location.origin);
      
      const endDate = new Date();
      let startDate = new Date();
      if (viewMode === 'daily') startDate.setDate(endDate.getDate() - 30);
      else if (viewMode === 'monthly') startDate.setFullYear(endDate.getFullYear() - 1);
      else if (viewMode === 'yearly') startDate.setFullYear(endDate.getFullYear() - 5);
      
      url.searchParams.append('startDate', startDate.toISOString());
      url.searchParams.append('endDate', endDate.toISOString());

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.data && Array.isArray(data.data)) {
        const processedData = processDataForChart(data.data);
        setChartData(processedData);
      } else {
        console.error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const processDataForChart = (data) => {
    const courseNames = [...new Set(data.map((item) => item.courseName))];
    let dates = [...new Set(data.map((item) => item.date))].sort();

    // Group data based on the selected view mode
    if (viewMode === 'monthly') {
      dates = [...new Set(dates.map(date => date.substring(0, 7)))].sort();
    } else if (viewMode === 'yearly') {
      dates = [...new Set(dates.map(date => date.substring(0, 4)))].sort();
    }

    const datasets = courseNames.map((courseName) => {
      let cumulativeEnrollments = 0;
      const courseData = dates.map((date) => {
        let items;
        if (viewMode === 'daily') {
          items = data.filter((d) => d.date === date && d.courseName === courseName);
        } else if (viewMode === 'monthly') {
          items = data.filter((d) => d.date.startsWith(date) && d.courseName === courseName);
        } else if (viewMode === 'yearly') {
          items = data.filter((d) => d.date.startsWith(date) && d.courseName === courseName);
        }
        cumulativeEnrollments += items.reduce((sum, item) => sum + item.enrollments, 0);
        return cumulativeEnrollments;
      });

      return {
        label: courseName,
        data: courseData,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        tension: 0.1,
      };
    });

    return {
      labels: dates.map((date) => {
        if (viewMode === 'daily') {
          const [, month, day] = date.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}`;
        } else if (viewMode === 'monthly') {
          const [year, month] = date.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[parseInt(month) - 1]} ${year}`;
        } else {
          return date; // For year grouping
        }
      }),
      datasets,
    };
  };

  const getMaxYValue = () => {
    if (!chartData || !chartData.datasets) return 100;
    const maxValue = Math.max(...chartData.datasets.flatMap((dataset) => dataset.data));
    return Math.ceil(maxValue * 1.1);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cumulative Course Enrollment Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: getMaxYValue(),
        title: {
          display: true,
          text: 'Total Enrollments',
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: viewMode === 'daily' ? 'Date' : viewMode === 'monthly' ? 'Month' : 'Year',
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="enrollment-chart">
      <div className="view-mode-buttons time-range-buttons">
        <button onClick={() => setViewMode('daily')} className={viewMode === 'daily' ? 'active' : ''}>
          Daily
        </button>
        <button onClick={() => setViewMode('monthly')} className={viewMode === 'monthly' ? 'active' : ''}>
          Monthly
        </button>
        <button onClick={() => setViewMode('yearly')} className={viewMode === 'yearly' ? 'active' : ''}>
          Yearly
        </button>
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        {chartData && <Line options={options} data={chartData} />}
      </div>
    </div>
  );
};

export default CourseEnrollmentChart;
