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
  const [timeRange, setTimeRange] = useState('1m');
  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - getTimeRangeInMilliseconds(timeRange));

    try {
      const url = new URL(`${API_URL}/analytics/course-enrollment-revenue`, window.location.origin);
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

  const getTimeRangeInMilliseconds = (range) => {
    const monthInMs = 30 * 24 * 60 * 60 * 1000;
    switch (range) {
      case '1m':
        return monthInMs;
      case '3m':
        return 3 * monthInMs;
      case '6m':
        return 6 * monthInMs;
      case '1y':
        return 12 * monthInMs;
      default:
        return monthInMs;
    }
  };

  const processDataForChart = (data) => {
    const courseNames = [...new Set(data.map((item) => item.courseName))];
    const dates = [...new Set(data.map((item) => item.date))].sort();

    const datasets = courseNames.map((courseName) => {
      let cumulativeEnrollments = 0;
      const courseData = dates.map((date) => {
        const items = data.filter((d) => d.date === date && d.courseName === courseName);
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
        const [year, month] = date.split('-');
        return `${year}-${month}`;
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
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className="enrollment-chart">
      <div className="time-range-buttons">
        <button onClick={() => setTimeRange('1m')} className={timeRange === '1m' ? 'active' : ''}>
          1 Month
        </button>
        <button onClick={() => setTimeRange('3m')} className={timeRange === '3m' ? 'active' : ''}>
          3 Months
        </button>
        <button onClick={() => setTimeRange('6m')} className={timeRange === '6m' ? 'active' : ''}>
          6 Months
        </button>
        <button onClick={() => setTimeRange('1y')} className={timeRange === '1y' ? 'active' : ''}>
          1 Year
        </button>
      </div>
      <div style={{ height: '300px' }}>
        {chartData && <Line options={options} data={chartData} />}
      </div>
    </div>
  );
};

export default CourseEnrollmentChart;
