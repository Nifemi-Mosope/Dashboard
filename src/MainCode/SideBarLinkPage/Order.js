import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Divider, List, Button, Modal, notification, Tag } from 'antd';
import { useMenuContext } from './MenuContext';
import moment from 'moment';

const Orders = () => {
  const [displayOrder, setDisplayOrder] = useState({});
  const [acceptClicked, setAcceptClicked] = useState(false);
  const { orders, updateOrderStatus } = useMenuContext();
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [foodAttended, setFoodAttended] = useState(false);
  const [foodDeclined, setFoodDeclined] = useState(false);

  useEffect(() => {
    if (orders.length > 0) {
      setDisplayOrder(orders[0]);
    }
  }, [orders]);

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

  const calculateTotalSum = (dishes) => {
    if (Array.isArray(dishes)) {
      return dishes.reduce((total, dishItem) => total + dishItem.price, 0);
    }
    return 0;
  };

  // Check if displayOrder.dishes is an array before using reduce
  const totalSum = calculateTotalSum(displayOrder.dishes);

  const handleAcceptClick = () => {
    updateOrderStatus(displayOrder.orderId, 'Attended');

    setAcceptClicked(true);

    notification.success({
      message: 'Order Status Accepted',
      description: 'The food has been accepted.',
      duration: 3,
    });
  };

  const showDeclineModal = () => {
    setDeclineModalVisible(true);
  };

  const hideDeclineModal = () => {
    setDeclineModalVisible(false);
  };
  
  const handleDeclineOrder = () => {
    updateOrderStatus(displayOrder.orderId, 'Cancelled');

    hideDeclineModal();

    notification.error({
      message: 'Order Cancelled',
      description: 'The food has been cancelled',
      duration: 3,
    });
    setFoodDeclined(true);
  };

  const handleFoodPackagedClick = () => {
    setFoodAttended(true);

    notification.success({
      message: 'Order Status Updated',
      description: 'The food has been packaged and is now ready for pickup.',
      duration: 3,
    });
  };

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', justifyContent: 'center' }}>
      {displayOrder.orderId && ( // Conditional rendering
        <Card title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Order {displayOrder.orderId}
              <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
                {moment(displayOrder.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
              </span>
            </div>
          } style={cardStyle}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">{displayOrder.orderId}</Descriptions.Item>
            <Descriptions.Item label="Customer">
              {displayOrder.customer || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Description" style={descriptionStyle}>
              {displayOrder.description || 'NIL'}
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
            dataSource={displayOrder.dishes || []}
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
            {!acceptClicked && !foodAttended && !foodDeclined && (
              <Button block type="danger" size="large" style={styles.button} onClick={showDeclineModal}>
                Delay or Decline Order
              </Button>
            )}
            {!acceptClicked && !foodAttended && !foodDeclined ? ( 
              <Button
                block
                type="primary"
                size="large"
                style={styles.button}
                onClick={handleAcceptClick}
              >
                Accept Order
              </Button>
            ) : null}
            {acceptClicked && !foodAttended && !foodDeclined ? ( 
              <Button block type="primary" size="large" onClick={handleFoodPackagedClick}>
                Food has been Packaged and now Ready for PickUp
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
      )}
    </div>
  );
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