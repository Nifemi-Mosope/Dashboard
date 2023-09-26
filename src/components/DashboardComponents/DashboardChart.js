import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { Card } from 'antd';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart({ loading }) {
  const revenueData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Revenue 2022',
        data: [
          12000,
          15000,
          18000,
          20000,
          22000,
          25000,
          28000,
          30000,
          32000,
          35000,
          38000,
          40000,
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Revenue 2023',
        data: [
          15000,
          18000,
          21000,
          24000,
          27000,
          30000,
          33000,
          36000,
          39000,
          42000,
          45000,
          48000,
        ],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Revenue',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const chartContainerStyle = {
    width: '100%',
    height: '17rem',
    marginRight: '150%',
    backgroundColor: 'white',
  };

  const cardStyle = {
    border: '1px solid #e8e8e8',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '34rem',
    bottom: '0%',
  };

  return (
    <Card title= "My Restaurant Revenue" style={cardStyle}>
      <div style={chartContainerStyle}>
        {loading ? (
          <div>Loading Chart...</div>
        ) : (
          <Line options={options} data={revenueData} />
        )}
      </div>
    </Card>
  );
}

export default DashboardChart;
