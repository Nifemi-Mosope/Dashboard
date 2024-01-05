import { Card, Space, Statistic, Typography } from "antd";
import { Chat, CurrencyNgn, Hamburger, ShoppingCart, User } from "phosphor-react";
import DashboardChart from "../../components/DashboardComponents/DashboardChart";
import RecentOrders from "../../components/DashboardComponents/RecentOrders";
import { useEffect, useState } from "react";
import { GetKitchenOrders, GetReviews } from "../Features/KitchenSlice";
import { useMenuContext } from "./MenuContext";

function Dashboard() {
  const [mostOrderedFood, setMostOrderedFood] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [previousDayTotalOrders, setPreviousDayTotalOrders] = useState(0);
  const [previousDayTotalCustomers, setPreviousDayTotalCustomers] = useState(0);
  const [previousDayTotalReviews, setPreviousDayTotalReviews] = useState(0);
  const [previousDayTotalRevenue, setPreviousDayTotalRevenue] = useState(0);
  const [dailyOrdersCount, setDailyOrdersCount] = useState(0);

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

  function calculateTotalRevenue(orders) {
    if (orders.length === 0) {
      return 0;
    }

    return orders.reduce((total, order) => {
      const orderTotal = parseFloat(order.TotalPrice || 0);
      return isNaN(orderTotal) ? total : total + orderTotal;
    }, 0);
  }

  function calculateMonthlyRevenue(orders) {
    // Filter orders for the current month with IsPaid === true
    const currentDate = new Date();
    const currentMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.CreatedAt);
      return (
        orderDate.getMonth() === currentDate.getMonth() &&
        orderDate.getFullYear() === currentDate.getFullYear() &&
        order.IsPaid === true
      );
    });
  
    // Calculate total revenue for the current month
    const totalRevenue = calculateTotalRevenue(currentMonthOrders);
    return totalRevenue;
  }
  
  useEffect(() => {
    const fetchKitchenOrders = async () => {
      try {
        const response = await GetKitchenOrders(userData, auth);
        if (response && response.code === 200) {
          const orders = response.body.Orders;
          const currentDateTodays = new Date();
          const currentDateOkay = new Date();

          const currentDayOrders = orders.filter((order) => {
            const orderDate = new Date(order.CreatedAt);
            return (
              orderDate.getDate() === currentDateTodays.getDate() &&
              orderDate.getMonth() === currentDateTodays.getMonth() &&
              orderDate.getFullYear() === currentDateTodays.getFullYear()
            );
          });
  
          const paidOrders = currentDayOrders.filter((order) => order.IsPaid === true);
          setTotalOrders(paidOrders.length);

          
          const currentMonthOrders = orders.filter((order) => {
            const orderDate = new Date(order.CreatedAt);
            return (
              orderDate.getMonth() === currentDateOkay.getMonth() &&
              orderDate.getFullYear() === currentDateOkay.getFullYear()
            );
          });

          const monthlyOrders = currentMonthOrders.filter((order) => order.IsPaid === true);
          if (monthlyOrders.length > 0) {
            const totalRevenueForMonth = calculateTotalRevenue(monthlyOrders);
            setTotalRevenue(totalRevenueForMonth);
          } else {
            setTotalRevenue(0);
          }

          const currentDateToday = new Date();
          const dailyOrders = calculateDailyOrders(orders, currentDateToday);
          setDailyOrdersCount(dailyOrders);

          const previousDayTotal = getPreviousDayTotalOrders();

          const currentDate = new Date();
          const totalCustomersForCurrentDate = calculateTotalCustomersForCurrentDate(orders, currentDate, true);
          setTotalCustomers(totalCustomersForCurrentDate);

          const reviewsResponse = await GetReviews(userData, auth);
          if (reviewsResponse && reviewsResponse.code === 200) {
            const reviews = reviewsResponse.body;

            const totalReviewsReceived = reviews ? reviews.length : 0;

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
            const orderDate = new Date(order.CreatedAt);
            if (
              orderDate.getDate() === currentDateToday.getDate() &&
              orderDate.getMonth() === currentDateToday.getMonth() &&
              orderDate.getFullYear() === currentDateToday.getFullYear() &&
              order.IsPaid === true
            ) {
              order.Items.forEach((item) => {
                const { Name } = item;
                if (foodCountMap[Name]) {
                  foodCountMap[Name] += 1;
                } else {
                  foodCountMap[Name] = 1;
                }
              });
            }
            return foodCountMap;
          }, {});
          
          const mostOrdered =
            Object.keys(mostOrderedFoodMap).length > 0
              ? Object.keys(mostOrderedFoodMap).reduce((mostOrdered, food) => {
                if (!mostOrdered || mostOrderedFoodMap[food] > mostOrderedFoodMap[mostOrdered]) {
                return food;
              }
                return mostOrdered;
          }, null)
          : "NILL";
          
          setMostOrderedFood(mostOrdered);
          
          setPreviousDayTotalOrders(previousDayTotal);

          const previousDayTotalCustomers = getPreviousDayTotalCustomers();
          setPreviousDayTotalCustomers(previousDayTotalCustomers);

          setPreviousDayTotalRevenue(previousDayTotalRevenue);

          // localStorage.setItem('totalOrders', totalOrdersReceived.toString());
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
  }, [userData.KitchenEmail, auth]);

  function calculateDailyOrders(orders, currentDate) {
    return orders.filter((order) => {
      const orderDate = new Date(order.CreatedAt);
      return (
        orderDate.getDate() === currentDate.getDate() &&
        orderDate.getMonth() === currentDate.getMonth() &&
        orderDate.getFullYear() === currentDate.getFullYear()
      );
    }).length;
  }

  function calculateTotalCustomersForCurrentDate(orders, currentDate, considerPaidOrders) {
    const customerSet = new Set();
  
    orders.forEach((order) => {
      const { CreatedAt, UserId, IsPaid } = order;
      const createdAtDate = new Date(CreatedAt);
  
      if (
        createdAtDate.getDate() === currentDate.getDate() &&
        createdAtDate.getMonth() === currentDate.getMonth() &&
        createdAtDate.getFullYear() === currentDate.getFullYear() &&
        (considerPaidOrders ? IsPaid === true : true)
      ) {
        customerSet.add(UserId);
      }
    });
  
    return customerSet.size;
  }  

  function calculateTotalRevenue(orders) {
    if (orders.length === 0) {
      return 0;
    }
  
    // Filter orders where IsPaid is true
    const paidOrders = orders.filter((order) => order.IsPaid === true);
  
    return paidOrders.reduce((total, order) => {
      const orderTotal = parseFloat(order.TotalAmount || 0);
      return isNaN(orderTotal) ? total : total + orderTotal;
    }, 0);
  }

  const isBasicStaff = userData && userData.Role === 'basic';
  if (isBasicStaff) {
    return (
      <div style={{ marginTop: "2rem", marginLeft: "7rem" }}>
        <Card title="Dashboard" style={{ width: "60rem" }}>
          <p>You do not have permission to access this page.</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div style={{ overflowX: "hidden" }}>
      <Space size={10} direction="vertical">
        <Typography.Title level={3}>Dashboard</Typography.Title>
        <Space size={15} direction="horizontal">
          <Card key="orders" style={{ backgroundColor: "#f2f2f2", borderColor: "black", flex: 1 }}>
            <Space direction="horizontal" size={15}>
              <ShoppingCart weight="fill" color="green" size={30} />
              <Statistic title="Orders" value={totalOrders} />
            </Space>
          </Card>
          <DashboardCard
            key="most-ordered"
            icon={<Hamburger weight="fill" color="green" size={30} />}
            title={"Most Ordered Food"}
            value={mostOrderedFood}
          />
          <DashboardCard
            key="customers"
            icon={<User weight="fill" color="blue" size={30} />}
            title={"Customers"}
            value={totalCustomers}
            previousValue={previousDayTotalCustomers}
          />
          <DashboardCard
            key="reviews"
            icon={<Chat weight="fill" color="#c45628" size={30} />}
            title={"Reviews"}
            value={totalReviews}
            previousValue={previousDayTotalReviews}
          />
          <DashboardCard
            key="revenue"
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