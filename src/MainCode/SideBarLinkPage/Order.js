import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Divider, List, Button, Modal, notification, Tag } from 'antd';
import { useMenuContext } from './MenuContext';
import moment from 'moment';
import { GetKitchenOrders, SendNotification } from '../Features/KitchenSlice';
import OrderHistoryCard from './OrderHistoryCard';

const Orders = () => {
  const { userData, auth } = useMenuContext();
  const [orders, setOrders] = useState([]);
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [attendedOrders, setAttendedOrders] = useState([]);
  const [doneAndPackagedOrders, setDoneAndPackagedOrders] = useState([]);
  const currentOrder = fetchedOrders[currentOrderIndex];
  // console.log('userData ', userData)
  
  const currentDate = moment();
  const today = currentDate.day();
  const filteredOrders = fetchedOrders.filter((order) => {
    const orderDate = moment(order.CreatedAt);
    return today === orderDate.day();
  });

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Failed to parse stored orders:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrdersResponse = await GetKitchenOrders(userData, auth);
        console.log('Okay' ,fetchedOrdersResponse);
        if (fetchedOrdersResponse.code === 200) {
          setFetchedOrders(fetchedOrdersResponse.body.Orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchOrders();
  }, [userData.KitchenEmail, auth]);

  const calculateTotalSum = (dishes) => {
    if (Array.isArray(dishes)) {
      return dishes.reduce((total, dishItem) => total + dishItem.Price, 0);
    }
    return 0;
  };

  const totalSum = fetchedOrders ? calculateTotalSum(fetchedOrders.Items) : 0;

  const handleSeeNextClick = () => {
    setCurrentOrderIndex((prevIndex) => {
      let newIndex = (prevIndex + 1) % fetchedOrders.length;
      while (!fetchedOrders[newIndex].IsPaid) {
        newIndex = (newIndex + 1) % fetchedOrders.length;
      }
      return newIndex;
    });
  };

  const handleAttendButtonClick = async () => {
    setAttendedOrders((prevAttendedOrders) => [
      ...prevAttendedOrders,
      currentOrder.TrxRef,
    ]);

    const notificationData = {
      KitchenId: userData.Id,
      Title: `${userData.KitchenName} - Your Order is being attended to`,
      UserId: currentOrder.UserId,
      Message: `Your order with ID ${currentOrder.TrxRef} is being attended to`,
    };
  
    const notificationResponse = await SendNotification(notificationData, auth);
    if (notificationResponse && notificationResponse.code === 200) {
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification:', notificationResponse);
    }
  };

  const handleDoneAndPackagedButtonClick = async () => {
    setDoneAndPackagedOrders((prevDoneAndPackagedOrders) => [
      ...prevDoneAndPackagedOrders,
      currentOrder.TrxRef,
    ]);
  
    const notificationData = {
      KitchenId: userData.Id,
      Title: `${userData.KitchenName} - Order Done and Packaged`,
      UserId: currentOrder.UserId,
      Message: `Your order with ID ${currentOrder.TrxRef} is done and packaged!. Come and pickup your food early so that it won't be cold. Thank you for using QuicKee`,
    };
  
    const notificationResponse = await SendNotification(notificationData, auth);
    if (notificationResponse && notificationResponse.code === 200) {
      console.log('Notification sent successfully');
    } else {
      console.error('Failed to send notification:', notificationResponse);
    }
  
    handleSeeNextClick();
  };

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', justifyContent: 'center' }}>
      {fetchedOrders.length > 0 && currentOrder && currentOrder.IsPaid ? (
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Order {currentOrder.TrxRef}
              <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
                {moment(currentOrder.CreatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </span>
            </div>
          }
          style={cardStyle}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">{currentOrder.TrxRef}</Descriptions.Item>
            <Descriptions.Item label="Customer Description">
              {currentOrder.Description}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <List
            dataSource={currentOrder.Items}
            renderItem={(dishItem, index) => (
              <List.Item key={index}>
                <div style={{ fontWeight: 'bold' }}>
                  {dishItem.Name} x{dishItem.Scoops}
                </div>
                <div>₦{dishItem.Price}</div>
              </List.Item>
            )}
          />
          <Divider />
          <div style={styles.totalSum}>
            <h2>Total:</h2>
            <h2 style={styles.totalPrice}>₦{currentOrder.TotalAmount}</h2>
          </div>
          <Divider />
          <div style={styles.buttonContainer}>
            {fetchedOrders.length > 1 && (
              !attendedOrders.includes(currentOrder.TrxRef) && (
                <Button
                  style={styles.seeNextButton}
                  onClick={handleAttendButtonClick}
                >
                  Attend Order {currentOrder.TrxRef}
                </Button>
              )
            )}
            {attendedOrders.includes(currentOrder.TrxRef) && (
              !doneAndPackagedOrders.includes(currentOrder.TrxRef) && (
                <Button
                  style={styles.seeNextButton}
                  onClick={handleDoneAndPackagedButtonClick}
                >
                  Done and Packaged
                </Button>
              )
            )}
          </div>
        </Card>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '2rem', color: 'grey', marginRight: '7%', marginTop: '20%' }}>
          {fetchedOrders.length === 0 ? 'No delicious orders have arrived just yet. The kitchen awaits its first culinary masterpiece! 🍔🍕🍝' : 'Loading...'}
        </div>
      )}
    </div>
  );
};

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
  seeNextButton: {
    marginLeft: 'auto',
    marginRight: '10%',
    background: '#006400',
    borderColor: '#52c41a',
    color: 'white',
    width: '600px',
    height: '40px',
    marginLeft: '60px',
  },
};

export default Orders;