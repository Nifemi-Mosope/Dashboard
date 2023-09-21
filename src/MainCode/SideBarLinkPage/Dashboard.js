import { Card, Space, Statistic, Table, Typography } from "antd";
import { Chat, CurrencyNgn, Hamburger, ShoppingCart, User } from "phosphor-react";
import { useEffect, useState } from "react";
import DashboardChart from "../../components/DashboardComponents/DashboardChart";
import RecentOrders from "../../components/DashboardComponents/RecentOrders";

function Dashboard() {
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
        <DashboardChart />
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
export default Dashboard;