import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyRevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const url = new URL(`${API_URL}/analytics/monthly-revenue`, window.location.origin);
      
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear() - 2, endDate.getMonth(), 1);
      
      url.searchParams.append('startDate', startDate.toISOString());
      url.searchParams.append('endDate', endDate.toISOString());

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw data from API:', data);

      if (data && data.data && Array.isArray(data.data)) {
        const years = [...new Set(data.data.map(item => new Date(item.date).getFullYear()))];
        setAvailableYears(years);

        const processedData = processDataForChart(data.data);
        console.log('Processed chart data:', processedData);
        setChartData(processedData);
      } else {
        console.error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching monthly revenue data:', error);
    }
  };

  const processDataForChart = (data) => {
    console.log('Data received in processDataForChart:', data);

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');

      return (selectedYear === 'all' || itemYear === selectedYear) &&
             (selectedMonth === 'all' || itemMonth === selectedMonth);
    });

    console.log('Filtered data:', filteredData);

    const courseNames = [...new Set(filteredData.map(item => item.courseName || 'Unknown Course'))];
    const dates = [...new Set(filteredData.map(item => item.date))].sort();

    console.log('Course names:', courseNames);
    console.log('Dates:', dates);

    const datasets = courseNames.map(courseName => {
      const courseData = dates.map(date => {
        const item = filteredData.find(d => d.date === date && (d.courseName || 'Unknown Course') === courseName);
        console.log(`Data for ${courseName} on ${date}:`, item);
        return item ? item.revenue : 0;
      });

      return {
        label: courseName,
        data: courseData,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      };
    });

    return {
      labels: dates.map(date => {
        const d = new Date(date);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      }),
      datasets
    };
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
        text: 'Monthly Revenue by Course',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue'
        }
      }
    }
  };

  return (
    <div className="monthly-revenue-chart">
      <div className="filter-controls">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="all">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="all">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year.toString()}>{year}</option>
          ))}
        </select>
      </div>
      <div style={{ height: '400px' }}>
        {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p>No data available for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;