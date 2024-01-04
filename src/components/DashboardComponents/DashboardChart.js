import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { GetKitchenOrders } from '../../MainCode/Features/KitchenSlice';
import { useMenuContext } from '../../MainCode/SideBarLinkPage/MenuContext';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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
  const [dailyRevenues, setDailyRevenues] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const { userData, auth } = useMenuContext();

  const getMonthYear = () => {
    const currentDate = new Date();
    const monthYearKey = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    return monthYearKey;
  };

  useEffect(() => {
    const fetchDailyRevenues = async () => {
      try {
        const response = await GetKitchenOrders(userData, auth);

        if (response && response.code === 200) {
          const orders = response.body.Orders;
          
          const paidOrders = orders.filter(order => order.IsPaid);
          

          const dailyRevenueData = calculateDailyRevenue(paidOrders);
          setDailyRevenues(dailyRevenueData);


          const totalRevenueForMonth = dailyRevenueData.reduce(
            (total, daily) => total + daily,
            0
          );
          setMonthlyRevenue(totalRevenueForMonth);

          const currentDate = new Date();
          const monthYearKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
          const updatedHistoricalData = [...historicalData];
          updatedHistoricalData.push({ monthYear: monthYearKey, revenue: totalRevenueForMonth });
          setHistoricalData(updatedHistoricalData);
        } else {
          console.error('Failed to fetch kitchen orders');
        }
      } catch (error) {
        console.error('Error fetching kitchen orders', error);
      }
    };

    fetchDailyRevenues();
  }, [userData.KitchenEmail, auth, historicalData]);

  const calculateDailyRevenue = (orders) => {
    const dailyRevenueData = new Array(31).fill(0);

    orders.forEach((order) => {
      const orderDate = new Date(order.CreatedAt);
      const dayOfMonth = orderDate.getDate();
      const orderTotal = order.TotalAmount || 0;
      dailyRevenueData[dayOfMonth - 1] += parseFloat(orderTotal);
    });

    return dailyRevenueData;
  };

  const revenueData = {
    labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: 'Daily Revenue',
        data: dailyRevenues,
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Daily Revenue For ${getMonthYear()}`,
        font: { size: 18 },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 14 },
        },
      },
      y: {
        type: 'linear',
        ticks: {
          font: { size: 14 },
          // stepSize: 'auto',
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
    <Card title="My Restaurant Revenue" style={cardStyle}>
      <div style={chartContainerStyle}>
        {loading ? (
          <div>Loading Chart...</div>
        ) : (
          <div>
            <Line options={options} data={revenueData} />
            {monthlyRevenue !== null && !historicalData.length ? (
              <p>
                Total Monthly Revenue: ₦
                {monthlyRevenue.toFixed(2)}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}

export default DashboardChart;
