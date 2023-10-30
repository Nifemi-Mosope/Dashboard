import React, { useEffect, useState }  from "react";
import { Card, Space, Statistic, Table, Typography } from "antd";

function RecentOrders() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
  
      const dummyData = [
        {
          key: "1",
          fullName: "John Doe",
          orderID: Math.floor(100000 + Math.random() * 900000),
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
      <Card
        title="Recent Orders"
        style={{
          width: '50%',
          border: '1px solid #e8e8e8',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          marginTop: '0%'
        }}
      >
        <Table
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={true}
          style={{ width: '100%' }}
          scroll={{ y: 150, maxHeight: '70vh' }}
        ></Table>
      </Card>
    );
}

export default RecentOrders;
