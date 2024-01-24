import React, { useEffect, useState } from "react";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { GetKitchenOrders } from "../../MainCode/Features/KitchenSlice";
import { useMenuContext } from "../../MainCode/SideBarLinkPage/Menus/MenuContext";
function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData, auth } = useMenuContext();

  useEffect(() => {
    setLoading(true);

    const fetchRecentOrders = async () => {
      try {
        const response = await GetKitchenOrders(userData, auth);

        if (response && response.code === 200) {
          const orders = response.body.Orders;
          if (orders && Array.isArray(orders)) {

            const currentDate = new Date();
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            // Filter and display only paid orders
            const recentOrders = orders.filter((order) => {
              const orderDate = new Date(order.CreatedAt);
              return (
                orderDate.getDate() === currentDay &&
                orderDate.getMonth() === currentMonth &&
                orderDate.getFullYear() === currentYear &&
                order.IsPaid === true
              );
            });

            recentOrders.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
            const firstFiveRecentOrders = recentOrders.slice(0, 5);
            setDataSource(firstFiveRecentOrders);
          } else {
            console.error("No valid orders found in the response.");
          }
        } else {
          console.error("Failed to fetch recent orders");
        }
      } catch (error) {
        console.error("Error fetching recent orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [userData.KitchenEmail, auth]);

  const columns = [
    {
      title: "Descriptions",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Order ID",
      dataIndex: "TrxRef",
      key: "TrxRef",
    },
    {
      title: "Title",
      dataIndex: "Items",
      key: "Items",
      render: (foodDetails) => (
        <ul>
          {foodDetails && foodDetails.map((foodItem, index) => (
            <li key={index}>
              {foodItem.Name} x{foodItem.Scoops} (₦{foodItem.Price})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
      render: (text, record) => (
        `₦${text}`
      )
    },
  ];

  return (
    <Card
      title="Recent Orders"
      style={{
        width: "50%",
        border: "1px solid #e8e8e8",
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        marginTop: "0%",
      }}
    >
      <Table
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        style={{ width: "100%" }}
        scroll={{ y: 150, maxHeight: "70vh" }}
      />
    </Card>
  );
}

export default RecentOrders;
