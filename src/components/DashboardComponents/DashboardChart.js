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
import RecentOrders from './RecentOrders';  
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
      height: '300px',
      marginRight: '150px',
      marginBottom: '60px'
    };
  
    return (
      <div style={chartContainerStyle}>
        {loading ? (
          <div>Loading Chart...</div>
        ) : (
          <Line options={options} data={revenueData} />
        )}
      </div>
    );
}
export default DashboardChart;