import { Card, Space, Statistic, Table, Typography } from "antd";
import { Chat, CurrencyNgn, Hamburger, ShoppingCart, User } from "phosphor-react";
import { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
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

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Space size={20}>
        <DashboardCard
          icon={<ShoppingCart weight="fill" color="green" size={30} />}
          title={"Orders"}
          value={123456}
          previousValue={120000}
        />
        <DashboardCard
          icon={<Hamburger weight="fill" color="green" size={30} />}
          title={"Most Food Ordered"}
          value={"Jollof Rice"}
        />
        <DashboardCard
          icon={<User weight="fill" color="blue" size={30} />}
          title={"Customers"}
          value={50}
          previousValue={45}
        />
        <DashboardCard
          icon={<Chat weight="fill" color="#c45628" size={30} />}
          title={"Reviews"}
          value={30}
          previousValue={35}
        />
        <DashboardCard
          icon={<CurrencyNgn weight="fill" color="black" size={30} />}
          title={"Total Revenue"}
          value={123456}
          previousValue={130000}
        />
      </Space>
      <Space>
        <RecentOrders />
        <DashboardChart revenueData={revenueData} />
      </Space>
    </Space>
  );
}

function DashboardCard({ title, value, icon, previousValue }) {
  const increase = value > previousValue;
  const percentageChange = ((value - previousValue) / previousValue) * 100;

  return (
    <Card style={{ backgroundColor: "#f2f2f2", borderColor: "black" }}>
      <Space direction="horizontal" size={8}>
        {icon}
        <Statistic title={title} value={value} />
        {title !== "Most Food Ordered" && (
          <span style={{ color: increase ? "green" : "red" }}>
            {increase ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
          </span>
        )}
      </Space>
    </Card>
  );
}

function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const dummyData = [
      {
        key: "1",
        fullName: "John Doe",
        orderID: Math.floor(100000 + Math.random() * 900000), // Generates a random 6-digit number
        title: "Burger",
        price: 10.99,
      },
      {
        key: "2",
        fullName: "Alice Smith",
        orderID: Math.floor(100000 + Math.random() * 900000),
        title: "Jollof Rice, Fried Rice, Chicken, Beef, Bottle Water",
        price: 15.99,
      },
      {
        key: "3",
        fullName: "Alice Smith",
        orderID: Math.floor(100000 + Math.random() * 900000),
        title: "Jollof Rice, Fried Rice, Chicken, Beef, Bottle Water",
        price: 15.99,
      },
      {
        key: "4",
        fullName: "Alice Smith",
        orderID: Math.floor(100000 + Math.random() * 900000),
        title: "Jollof Rice, Fried Rice, Chicken, Beef, Bottle Water",
        price: 15.99,
      },
    ];

    setTimeout(() => {
      setDataSource(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₦${price.toFixed(2)}`,
    },
  ];

  return (
    <>
      <Typography.Text>Recent Orders</Typography.Text>
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={true}
        style={{ width: '85%' }}
        scroll={{ y: 150, maxHeight: '70vh' }}
      ></Table>
    </>
  );
}

function DashboardChart({ revenueData, loading }) {
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
export default Dashboard;
