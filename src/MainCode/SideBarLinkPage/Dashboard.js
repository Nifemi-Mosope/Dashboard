import { Card, Space, Statistic, Typography } from "antd";
import { Chat, CurrencyNgn, Hamburger, ShoppingCart, User } from "phosphor-react";
import DashboardChart from "../../components/DashboardComponents/DashboardChart";
import RecentOrders from "../../components/DashboardComponents/RecentOrders";
import { useEffect, useState } from "react";
import { GetKitchenOrders, GetReviews } from "../Features/KitchenSlice";
import { useMenuContext } from "./MenuContext";

function Dashboard() {
  const [dailyCustomerCounts, setDailyCustomerCounts] = useState([]);
  const [mostOrderedFood, setMostOrderedFood] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [previousDayTotalOrders, setPreviousDayTotalOrders] = useState(0);
  const [previousDayTotalCustomers, setPreviousDayTotalCustomers] = useState(0);
  const [previousDayTotalReviews, setPreviousDayTotalReviews] = useState(0);
  const [previousDayTotalRevenue, setPreviousDayTotalRevenue] = useState(0);

  const { userData, auth } = useMenuContext();

  const getPreviousDayTotalOrders = () => {
    const storedOrders = localStorage.getItem('totalOrders');
    if (storedOrders) {
      return parseInt(storedOrders, 10);
    }
    return 0;
  };

  const getPreviousDayTotalCustomers = () => {
    const storedCustomers = localStorage.getItem('totalCustomers');
    if (storedCustomers) {
      return parseInt(storedCustomers, 10);
    }
    return 0;
  };

  const getPreviousDayTotalReviews = () => {
    const storedReviews = localStorage.getItem('totalReviews');
    if (storedReviews) {
      return parseInt(storedReviews, 10);
    }
    return 0;
  };

  const getPreviousDayTotalRevenue = () => {
    const storedRevenue = localStorage.getItem('totalRevenue');
    if (storedRevenue) {
      return parseFloat(storedRevenue);
    }
    return 0;
  };

  useEffect(() => {
    const fetchKitchenOrders = async () => {
      try {
        const data = { Email: userData.KitchenEmail };
        const response = await GetKitchenOrders(data, auth);
        if (response && response.code === 200) {
          const orders = response.body.Orders;
          const totalOrdersReceived = orders.length;
          setTotalOrders(totalOrdersReceived);

          const previousDayTotal = getPreviousDayTotalOrders();

          const currentDate = new Date();
          const totalCustomersForCurrentDate = calculateTotalCustomersForCurrentDate(orders, currentDate);
          setTotalCustomers(totalCustomersForCurrentDate);

          const reviewsResponse = await GetReviews(userData, auth);
          if (reviewsResponse && reviewsResponse.code === 200) {
            const reviews = reviewsResponse.body;
            const totalReviewsReceived = reviews.length;
            setTotalReviews(totalReviewsReceived);
            const previousDayTotalReviews = getPreviousDayTotalReviews();
            setPreviousDayTotalReviews(previousDayTotalReviews);
            localStorage.setItem('totalReviews', totalReviewsReceived.toString());
          } else {
            console.error("Failed to fetch kitchen reviews");
          }

          const totalRevenueReceived = calculateTotalRevenue(orders);
          setTotalRevenue(totalRevenueReceived);
          const previousDayTotalRevenue = getPreviousDayTotalRevenue();
          setPreviousDayTotalRevenue(previousDayTotalRevenue);
          localStorage.setItem('totalRevenue', totalRevenueReceived.toString());

          const mostOrderedFoodMap = orders.reduce((foodCountMap, order) => {
            order.Items.forEach((item) => {
              const { Name } = item;
              if (foodCountMap[Name]) {
                foodCountMap[Name] += 1;
              } else {
                foodCountMap[Name] = 1;
              }
            });
            return foodCountMap;
          }, {});

          const mostOrdered = Object.keys(mostOrderedFoodMap).reduce((mostOrdered, food) => {
            if (!mostOrdered || mostOrderedFoodMap[food] > mostOrderedFoodMap[mostOrdered]) {
              return food;
            }
            return mostOrdered;
          });

          setMostOrderedFood(mostOrdered);

          setPreviousDayTotalOrders(previousDayTotal);

          // Calculate the previous day total customers
          const previousDayTotalCustomers = getPreviousDayTotalCustomers();
          setPreviousDayTotalCustomers(previousDayTotalCustomers);

          // Update previous day total revenue
          setPreviousDayTotalRevenue(previousDayTotalRevenue);

          localStorage.setItem('totalOrders', totalOrdersReceived.toString());
          localStorage.setItem('totalCustomers', totalCustomersForCurrentDate.toString());
          localStorage.setItem('totalRevenue', totalRevenueReceived.toString());
        } else {
          console.error("Failed to fetch kitchen orders");
        }
      } catch (error) {
        console.error("Error fetching kitchen orders", error);
      }
    };
    fetchKitchenOrders();
  }, []);

  function calculateTotalCustomersForCurrentDate(orders, currentDate) {
    const customerSet = new Set();

    orders.forEach((order) => {
      const { CreatedAt, UserId } = order;
      const createdAtDate = new Date(CreatedAt);

      if (
        createdAtDate.getDate() === currentDate.getDate() &&
        createdAtDate.getMonth() === currentDate.getMonth() &&
        createdAtDate.getFullYear() === currentDate.getFullYear()
      ) {
        customerSet.add(UserId);
      }
    });

    return customerSet.size;
  }

  function calculateTotalRevenue(orders) {
    return orders.reduce((total, order) => total + order.TotalPrice, 0);
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      <Space size={10} direction="vertical">
        <Typography.Title level={3}>Dashboard</Typography.Title>
        <Space size={15}>
          <DashboardCard
            icon={<ShoppingCart weight="fill" color="green" size={30} />}
            title={"Orders"}
            value={totalOrders}
            previousValue={previousDayTotalOrders}
          />
          <DashboardCard
            icon={<Hamburger weight="fill" color="green" size={30} />}
            title={"Most Ordered Food"}
            value={mostOrderedFood}
          />
          <DashboardCard
            icon={<User weight="fill" color="blue" size={30} />}
            title={"Customers"}
            value={totalCustomers}
            previousValue={previousDayTotalCustomers}
          />
          <DashboardCard
            icon={<Chat weight="fill" color="#c45628" size={30} />}
            title={"Reviews"}
            value={totalReviews}
            previousValue={previousDayTotalReviews}
          />
          <DashboardCard
            icon={<CurrencyNgn weight="fill" color="black" size={30} />}
            title={"Total Revenue"}
            value={totalRevenue}
            previousValue={previousDayTotalRevenue}
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

function DashboardCard({ title, value, icon, previousValue }) {
  const increase = value > previousValue;
  const showPercentageChange = title !== "Most Ordered Food" && title !== "Reviews";
  
  const isNotFirstDay = previousValue !== 0;
  const percentageChange = showPercentageChange && isNotFirstDay
    ? ((value - previousValue) / previousValue) * 100
    : 0;

  return (
    <Card style={{ backgroundColor: "#f2f2f2", borderColor: "black" }}>
      <Space direction="horizontal" size={8}>
        {icon}
        <Statistic title={title} value={value} />
        {showPercentageChange && (
          <span style={{ color: increase ? "green" : "red" }}>
            {increase ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
          </span>
        )}
      </Space>
    </Card>
  );
}

export default Dashboard;
