import React, { useState } from 'react';
import { Card, Descriptions, Divider, List, Button, Modal } from 'antd';
import { useMenuContext } from './MenuContext';

function Orders() {
  const [displayOrder, setDisplayOrder] = useState({});
  const [acceptClicked, setAcceptClicked] = useState(false);
  const { orders } = useMenuContext();
  const [declineModalVisible, setDeclineModalVisible] = useState(false);

  useState(() => {
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

  const totalSum = Array.isArray(displayOrder.dishes)
    ? displayOrder.dishes.reduce((total, dishItem) => total + dishItem.price, 0)
    : 0;

  const handleAcceptClick = () => {
    setAcceptClicked(true);
  };

  const showDeclineModal = () => {
    setDeclineModalVisible(true);
  };
  
  const hideDeclineModal = () => {
    setDeclineModalVisible(false);
  };
  

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', justifyContent: 'center' }}>
      <Card title={`Order ${displayOrder.orderId}`} style={cardStyle}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order ID">{displayOrder.orderId}</Descriptions.Item>
          <Descriptions.Item label="Customer">
            {displayOrder.customer || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Description" style={descriptionStyle}>
            {displayOrder.description || 'NIL'}
          </Descriptions.Item>
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
          {!acceptClicked && (
            <Button block type="danger" size="large" style={styles.button} onClick={showDeclineModal}>
              Delay or Decline Order
            </Button>
          )}
    
          {!acceptClicked ? ( // Show "Accept Order" button if acceptClicked is false
            <Button
              block
              type="primary"
              size="large"
              style={styles.button}
              onClick={handleAcceptClick} // Call the function when "Accept Order" is clicked
            >
              Accept Order
            </Button>
          ) : ( // Show "Food has been Packaged" button if acceptClicked is true
            <Button block type="primary" size="large">
              Food has been Packaged and now Ready for PickUp
            </Button>
          )}
        </div>
        <Modal
          title="Confirm Order Cancellation"
          open={declineModalVisible}
          onOk={() => {
            hideDeclineModal();
          }}
          onCancel={hideDeclineModal} // Close the modal when canceled
          okText="Yes"
          cancelText="No"
          okButtonProps={{ type: 'danger' }}
        >
          Are you sure you want to decline this order?
        </Modal>
      </Card>
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

export default Orders;
