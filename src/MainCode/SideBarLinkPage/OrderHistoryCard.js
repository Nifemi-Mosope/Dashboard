import React from 'react';
import { Card, Descriptions, Divider, List, Tag } from 'antd';
import moment from 'moment';
import { useMenuContext } from './MenuContext';

function OrderHistoryCard({ order }) {
  const { orderHistory } = useMenuContext();
  const cardStyle = {
    margin: '1rem',
    width: '45rem',
    height: '650px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    marginLeft: '8rem',
  };

  const descriptionStyle = {
    whiteSpace: 'pre-wrap',
    maxWidth: '300px',
  };

  // Check if 'order' exists and has 'dishes' property
  const totalSum = order && Array.isArray(order.dishes)
    ? order.dishes.reduce((total, dishItem) => total + dishItem.price, 0)
    : 0;

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', justifyContent: 'center' }}>
      {orderHistory.map((historyOrder, index) => (
        <Card title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Order {historyOrder.orderID}
              <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
                {moment(historyOrder.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </span>
            </div>
          } style={cardStyle} key={index}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">{historyOrder.orderID}</Descriptions.Item>
            <Descriptions.Item label="Description" style={descriptionStyle}>
              {historyOrder.description || 'NIL'}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <List
            dataSource={historyOrder.dishes || []}
            renderItem={(dishItem) => (
              <List.Item>
                <div style={{ fontWeight: 'bold' }}>
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
            {historyOrder.status === 'Attended' && (
              <Tag color={'green'}>Attended</Tag>
            )}
            {historyOrder.status === 'Cancelled' && (
              <Tag color={'red'}>Cancelled</Tag>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

const styles = {
  totalSum: {
    flexDirection: 'row',
    display: 'flex',
  },
  totalPrice: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    paddingBottom: 30,
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
  },
};

export default OrderHistoryCard;
