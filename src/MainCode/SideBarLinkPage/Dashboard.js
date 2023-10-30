import { Card, Space, Statistic, Typography } from "antd";
import { Chat, CurrencyNgn, Hamburger, ShoppingCart, User } from "phosphor-react";
import DashboardChart from "../../components/DashboardComponents/DashboardChart";
import RecentOrders from "../../components/DashboardComponents/RecentOrders";
import { useEffect, useState } from "react";

function Dashboard() {
  const [dailyCustomerCounts, setDailyCustomerCounts] = useState([]);
  const [mostOrderedFood, setMostOrderedFood] = useState("");

  useEffect(() => {
    const orders = [
      { customer: "Customer1", date: "2023-10-18", food: "Fried Rice" },
      { customer: "Customer2", date: "2023-10-18", food: "Fried Chicken" },
      { customer: "Customer3", date: "2023-10-19", food: "Fried Rice" },
      { customer: "Customer1", date: "2023-10-19", food: "Burger" },
    ];

    const counts = orders.reduce((result, order) => {
      const date = order.date;
      const customer = order.customer;
      const food = order.food;

      if (!result[date]) {
        result[date] = {
          customers: new Set(),
          foodCounts: {},
        };
      }

      result[date].customers.add(customer);

      if (!result[date].foodCounts[food]) {
        result[date].foodCounts[food] = 0;
      }

      result[date].foodCounts[food]++;

      return result;
    }, {});

    const dailyCountsArray = Object.keys(counts).map((date) => ({
      date,
      customerCount: counts[date].customers.size,
      foodCounts: counts[date].foodCounts,
    }));

    setDailyCustomerCounts(dailyCountsArray);

    if (dailyCountsArray.length > 0) {
      const todayData = dailyCountsArray[dailyCountsArray.length - 1];
      const mostOrdered = Object.keys(todayData.foodCounts).reduce(
        (mostOrdered, food) => {
          if (!mostOrdered || todayData.foodCounts[food] > todayData.foodCounts[mostOrdered]) {
            return food;
          }
          return mostOrdered;
        },
        ""
      );
      setMostOrderedFood(mostOrdered);
    }
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Space size={10} direction="vertical">
        <Typography.Title level={3}>Dashboard</Typography.Title>
        <Space size={15}>
          <DashboardCard
            icon={<ShoppingCart weight="fill" color="green" size={30} />}
            title={"Orders"}
            value={123456}
            previousValue={120000}
          />
          <DashboardCard
            icon={<Hamburger weight="fill" color="green" size={30} />}
            title={"Most Ordered Food"}
            value={mostOrderedFood}
          />
          <DashboardCard
            icon={<User weight="fill" color="blue" size={30} />}
            title={"Customers"}
            value={calculateTotalCustomers(dailyCustomerCounts)}
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <RecentOrders />
          <div style={{ marginLeft: "20px" }}>
            <DashboardChart />
          </div>
        </div>
      </Space>
    </div>
  );
}

function calculateTotalCustomers(dailyCounts) {
  return dailyCounts.reduce((total, dailyCount) => total + dailyCount.customerCount, 0);
}

function DashboardCard({ title, value, icon, previousValue }) {
  const increase = value > previousValue;
  const percentageChange = ((value - previousValue) / previousValue) * 100;

  return (
    <Card style={{ backgroundColor: "#f2f2f2", borderColor: "black" }}>
      <Space direction="horizontal" size={8}>
        {icon}
        <Statistic title={title} value={value} />
        {title !== "Most Ordered Food" && (
          <span style={{ color: increase ? "green" : "red" }}>
            {increase ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
          </span>
        )}
      </Space>
    </Card>
  );
}

export default Dashboard;