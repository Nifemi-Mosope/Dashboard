import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Divider, List, Button, Modal, notification, Tag } from 'antd';
import { useMenuContext } from './MenuContext';
import moment from 'moment';
import { GetKitchenOrders, SendNotification } from '../Features/KitchenSlice';
import OrderHistoryCard from './OrderHistoryCard';

const Orders = () => {
  const [displayOrder, setDisplayOrder] = useState(null);
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [acceptClicked, setAcceptClicked] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [foodAttended, setFoodAttended] = useState(false);
  const [foodDeclined, setFoodDeclined] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const { userData, auth, addToOrderHistory } = useMenuContext();
  const [orders, setOrders] = useState([]);

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
      const payload = {
        Email: userData.KitchenEmail,
      };
      try {
        const fetchedOrdersResponse = await GetKitchenOrders(payload, auth);
        if (fetchedOrdersResponse.code === 200) {
          setFetchedOrders(fetchedOrdersResponse.body.Orders);
          console.log('Check 1' ,fetchedOrdersResponse.body.Orders)
          saveOrdersToLocalStorage(fetchedOrdersResponse.body.Orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchOrders();
  }, [userData.KitchenEmail, auth]);

  const saveOrdersToLocalStorage = (orders) => {
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map((order) => {
      if (order.orderId === orderId) {
        return { ...order, status };
      }
      return order;
    });

    setOrders(updatedOrders);

    if (status === 'Attended' || status === 'Cancelled') {
      const orderToMove = orders.find((order) => order.orderId === orderId);
      setOrderHistory([...orderHistory, orderToMove]);
    }
  };

  const handleAcceptClick = async () => {
    const payload = {
      KitchenId: userData.KitchenId,
      Title: 'Order Accepted',
      UserId: fetchedOrders.UserId,
      Message: 'Your order has been accepted.',
    };

    try {
      const notificationResponse = await SendNotification(payload, auth);
      console.log(notificationResponse);
      if (notificationResponse) {
        notification.success({
          message: 'Order Status Accepted',
          description: 'The food has been accepted. Notification sent.',
          duration: 3,
        });
      } else {
        notification.error({
          message: 'Notification Error',
          description: 'Failed to send notification.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Failed to send notification', error);
      notification.error({
        message: 'Notification Error',
        description: 'An error occurred while sending the notification.',
        duration: 3,
      });
    }

    setAcceptClicked(true);
  };

  const showDeclineModal = () => {
    setDeclineModalVisible(true);
  };

  const hideDeclineModal = () => {
    setDeclineModalVisible(false);
  };

  const handleDeclineOrder = async () => {
    const payload = {
      KitchenId: userData.KitchenId,
      Title: 'Order Declined',
      UserId: fetchedOrders.UserId,
      Message: 'Your order has been been declined due to some abnormalities in the Kitchen, We are sorry for the inconvience, please do well to check your wallet for your balance',
    };

    try {
      const notificationResponse = await SendNotification(payload, auth);
      console.log(notificationResponse);
      if (notificationResponse) {
        notification.error({
          message: 'Order Status Cancelled',
          description: 'The food has been cancelled.',
          duration: 3,
        });
      } else {
        notification.error({
          message: 'Notification Error',
          description: 'Failed to send notification.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Failed to send notification', error);
      notification.error({
        message: 'Notification Error',
        description: 'An error occurred while sending the notification.',
        duration: 3,
      });
    }
    hideDeclineModal();
    setFoodDeclined(true);
    addToOrderHistory(fetchedOrders[0]);
  };

  const handleFoodPackagedClick = async () => {
    const payload = {
      KitchenId: userData.KitchenId,
      Title: 'Order Done & Packaged  ',
      UserId: fetchedOrders.UserId,
      Message: 'Your order has been done and packaged, please do well to come and pick up your food as early as possible. Thank you using QuicKee 😊',
    };

    try {
      const notificationResponse = await SendNotification(payload, auth);
      console.log(notificationResponse);
      if (notificationResponse) {
        notification.success({
          message: 'Order Status Packaged & Done',
          description: 'The food has been packaged. Notification sent. Thank you for your Time 😊',
          duration: 3,
        });
      } else {
        notification.error({
          message: 'Notification Error',
          description: 'Failed to send notification.',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Failed to send notification', error);
      notification.error({
        message: 'Notification Error',
        description: 'An error occurred while sending the notification.',
        duration: 3,
      });
    }
    setFoodAttended(true);
    addToOrderHistory(fetchedOrders[0]);
  };

  const calculateTotalSum = (dishes) => {
    if (Array.isArray(dishes)) {
      return dishes.reduce((total, dishItem) => total + dishItem.Price, 0);
    }
    return 0;
  };

  const totalSum = fetchedOrders ? calculateTotalSum(fetchedOrders.Items) : 0;

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', justifyContent: 'center' }}>
      {fetchedOrders.length > 0 ? (
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Order {fetchedOrders[0].TrxRef}
              <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
                {moment(fetchedOrders[0].CreatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </span>
            </div>
          }
          style={cardStyle}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">{fetchedOrders[0].TrxRef}</Descriptions.Item>
            <Descriptions.Item label="Customer Description" style={descriptionStyle}>
              {fetchedOrders[0].Description || 'NIL'}
            </Descriptions.Item>
            {foodAttended ? (
              <Descriptions.Item label="Status">
                <Tag color="green">Attended</Tag>
              </Descriptions.Item>
            ) : null}
            {foodDeclined ? (
              <Descriptions.Item label="Status">
                <Tag color="red">Cancelled</Tag>
              </Descriptions.Item>
            ) : null}
          </Descriptions>
          <Divider />
          <List
            dataSource={fetchedOrders[0].Items}
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
            <h2 style={styles.totalPrice}>₦{fetchedOrders[0].TotalAmount}</h2>
          </div>
          <Divider />
          <div style={styles.buttonContainer}>
            {!acceptClicked && !foodAttended && !foodDeclined && (
              <Button block type="danger" size="large" style={styles.button} onClick={showDeclineModal}>
                Delay or Decline Order
              </Button>
            )}
            {!acceptClicked && !foodAttended && !foodDeclined ? (
              <Button block type="primary" size="large" style={styles.button} onClick={handleAcceptClick}>
                Accept Order
              </Button>
            ) : null}
            {acceptClicked && !foodAttended && !foodDeclined ? (
              <Button block type="primary" size="large" onClick={handleFoodPackagedClick}>
                Food has been Packaged and is now Ready for PickUp
              </Button>
            ) : null}
          </div>
          <Modal
            title="Confirm Order Cancellation"
            open={declineModalVisible}
            onOk={handleDeclineOrder}
            onCancel={hideDeclineModal}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ type: 'danger' }}
          >
            Are you sure you want to decline this order?
          </Modal>
        </Card>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'grey' }}>
          {fetchedOrders.length === 0 ? 'No orders fetched yet' : 'Loading...'}
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
  button: {
    marginRight: 20,
    marginLeft: 20,
  },
};

export default Orders;
