import { Card, Space, Statistic, Table, Typography } from "antd";
import React, { useEffect, useState }  from "react";

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

export default RecentOrders;