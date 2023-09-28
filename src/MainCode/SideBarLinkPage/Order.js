import React, { useState } from "react";
import { Card, Descriptions, Divider, List, Button, Row, Col } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

function Orders() {
  const { orderId } = useParams();
  const location = useLocation();
  const orderItem = location.state;

  const orders = [
    {
        orderId: 1,
        customer: "Customer 1",
        description: "Order 1 description",
        dishes: [
            {
                dish: "Jollof Rice",
                scoops: 2,
                price: 2500
            },
        ]
    },
    {
        orderId: 2,
        customer: "Customer 2",
        description: "Order 2 description",
        dishes: [
            {
                dish: "Fried Rice",
                scoops: 1,
                price: 1800
            },
            // Add more dishes for this order
        ]
    },
  ];

  const cardStyle = {
    margin: '1rem',
    width: "45rem",
    height: "780px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    marginLeft: '8rem'
  };

  const descriptionStyle = {
    whiteSpace: "pre-wrap",
    maxWidth: "300px",
  };

  // Create state to track the current orderId
  const [currentOrderId, setCurrentOrderId] = useState(orderId);
  // State for total sum
  const totalSum = dishes.reduce((total, dishItem) => total + dishItem.price, 0);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0); // Initialize with the first order

  const displayOrder = orders[currentOrderIndex];

  const handleNextOrderClick = () => {
      const nextIndex = currentOrderIndex + 1;

      // Check if the next index is within bounds
      if (nextIndex < orders.length) {
          setCurrentOrderIndex(nextIndex);
      }
  };

  // Function to handle navigation to the next order
  const handleNextOrder = () => {
    // Logic to get the next orderId (you need to implement this)
    // For example, if you have an array of orderIds, you can find the index of the current orderId and navigate to the next index.
    // Make sure to handle the case when there are no more orders.
    // For this example, let's assume you have an array of orderIds called "orderIds."
    const orderIds = ["order1", "order2", "order3"]; // Replace with your orderIds
    const currentIndex = orderIds.indexOf(currentOrderId);
    if (currentIndex !== -1 && currentIndex < orderIds.length - 1) {
      setCurrentOrderId(orderIds[currentIndex + 1]);
    }
  };

  // Function to handle navigation to the previous order
  const handlePreviousOrder = () => {
    // Logic to get the previous orderId (you need to implement this)
    // For example, if you have an array of orderIds, you can find the index of the current orderId and navigate to the previous index.
    // Make sure to handle the case when there are no previous orders.
    // For this example, let's assume you have an array of orderIds called "orderIds."
    const orderIds = ["order1", "order2", "order3"]; // Replace with your orderIds
    const currentIndex = orderIds.indexOf(currentOrderId);
    if (currentIndex > 0) {
      setCurrentOrderId(orderIds[currentIndex - 1]);
    }
  };

  return (
    <div style={{ marginLeft: "7rem", display: "flex", justifyContent: "center" }}>
      <Button
        type="primary"
        shape="circle"
        icon={<CaretLeftOutlined />}
        onClick={handlePreviousOrder}
        style={{ position: "absolute", left: '14rem', top: "60%", transform: "translateY(-50%)" }}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<CaretRightOutlined />}
        onClick={handleNextOrder}
        style={{ position: "absolute", right: 0, top: "60%", transform: "translateY(-50%)" }}
      />

      <Card title={`Order ${currentOrderId}`} style={cardStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order ID">{currentOrderId}</Descriptions.Item>
          <Descriptions.Item label="Customer">
            {orderItem?.customer || "N/A"} {/* Use optional chaining */}
          </Descriptions.Item>
          <Descriptions.Item
            label="Customer Description"
            style={descriptionStyle}
          >
            {orderItem?.description || "NIL"}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <List
          dataSource={dishes}
          renderItem={(dishItem) => (
            <List.Item>
              <div style={{ fontWeight: "bold" }}>
                {dishItem.dish} x{dishItem.scoops}
              </div>
              <div>₦{dishItem.price}</div>
            </List.Item>
          )}
        />
        <Divider />
        <div style={styles.totalSum}>
          <h2>Total:</h2>
          <h2 style={styles.totalPrice}>₦{totalSum}</h2>
        </div>
        <Divider />
        <div style={styles.buttonContainer}>
          <Button
            block
            type="danger"
            size="large"
            style={styles.button}
          >
            Delay or Decline Order
          </Button>
          <Button
            block
            type="primary"
            size="large"
            style={styles.button}
          >
            Accept Order
          </Button>
        </div>
        <Button block type="primary" size="large">
          Food has been Packaged and now Ready for PickUp
        </Button>
      </Card>
    </div>
  );
}

const styles = {
  totalSum: {
    flexDirection: "row",
    display: "flex",
  },
  totalPrice: {
    marginLeft: "auto",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    paddingBottom: 30,
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
  },
};

export default Orders;
