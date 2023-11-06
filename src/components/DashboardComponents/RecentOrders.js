import React, { useEffect, useState } from "react";
import { Card, Space, Statistic, Table, Typography } from "antd";
import { GetKitchenOrders } from "../../MainCode/Features/KitchenSlice";
import { useMenuContext } from "../../MainCode/SideBarLinkPage/MenuContext";

function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData, auth } = useMenuContext();

  useEffect(() => {
    setLoading(true);

    const fetchRecentOrders = async () => {
      try {
        const data = { Email: userData.KitchenEmail };
        const response = await GetKitchenOrders(data, auth);

        if (response && response.code === 200) {
          const orders = response.body.Orders;
          if (orders && Array.isArray(orders)) {
            const recentOrders = orders.slice(0, 5);
            setDataSource(recentOrders);
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
  }, []);

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
