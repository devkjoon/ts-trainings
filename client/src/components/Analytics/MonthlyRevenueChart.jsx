import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyRevenueChart = () => {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = currentDate.getFullYear().toString();

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

      if (data && data.data && Array.isArray(data.data)) {
        const years = [...new Set(data.data.map(item => new Date(item.date).getFullYear()))];
        setAvailableYears(years);

        const processedData = processDataForChart(data.data);
        setChartData(processedData);
      } else {
        console.error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching monthly revenue data:', error);
    }
  };

  const processDataForChart = (data) => {

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');

      return (selectedYear === 'all' || itemYear === selectedYear) &&
             (selectedMonth === 'all' || itemMonth === selectedMonth);
    });

    const courseNames = [...new Set(filteredData.map(item => item.courseName || 'Unknown Course'))];
    const dates = [...new Set(filteredData.map(item => item.date))].sort();

    const datasets = courseNames.map(courseName => {
      const courseData = dates.map(date => {
        const item = filteredData.find(d => d.date === date && (d.courseName || 'Unknown Course') === courseName);
        return item ? item.revenue : 0;
      });

      return {
        label: courseName,
        data: courseData,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
      };
    });

    // Add a dataset for the total
    const totalData = dates.map(date => {
      return filteredData
        .filter(item => item.date === date)
        .reduce((sum, item) => sum + item.revenue, 0);
    });

    datasets.push({
      label: 'Total',
      data: totalData,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      // This will make the total bar wider
      barPercentage: 0.8,
      categoryPercentage: 0.8
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
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue'
        }
      }
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="monthly-revenue-chart">
      <div className="filter-controls">
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="all">All Months</option>
          <option value={currentMonth}>{getMonthName(parseInt(currentMonth))} (Current)</option>
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
          <option value={currentYear}>{currentYear} (Current)</option>
          {availableYears
            .filter(year => year.toString() !== currentYear)
            .map(year => (
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