import React, { useState, useEffect, useRef } from 'react';
import { Card, Descriptions, Divider, List, Button, Modal, message, Tag, Input, Collapse, Select } from 'antd';
import { useMenuContext } from '../Menus/MenuContext';
import moment from 'moment';
import { GetKitchenOrders, SendNotification } from '../../Features/KitchenSlice';
import { ChatCircleDots } from 'phosphor-react';
const { Panel } = Collapse;
const { Option } = Select;

const Orders = () => {
  const { userData, auth } = useMenuContext();
  const [orders, setOrders] = useState([]);
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [attendedOrders, setAttendedOrders] = useState([]);
  const [doneAndPackagedOrders, setDoneAndPackagedOrders] = useState([]);
  const [isChatModalVisible, setChatModalVisible] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [orderNumber, setOrderNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendedFilter, setAttendedFilter] = useState(null);

  const handleAttendedFilterChange = (value) => {
    setAttendedFilter(value);
  };

  const currentDate = moment();
  const today = currentDate.date();

  const filteredOrders = fetchedOrders.filter((order) => {
    const orderDate = moment(order.CreatedAt);
    return today === orderDate.date() && order.IsPaid === true
    ;
  }); 
    
  const currentOrder = filteredOrders[currentOrderIndex]

  const handleChatIconClick = () => {
    setChatModalVisible(true);
  };
  
  const handleModalCancel = () => {
    setChatModalVisible(false);
  };
  
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSendMessage = async () => {
    let notificationData;
  
    if (userData && userData.Role === 'basic') {
      notificationData = {
        KitchenId: userData.KitchenId,
        Title: `${userData.FirstName} (staff)`,
        UserId: currentOrder.UserId,
        Message: messageInput,
        OrderId: currentOrder.TrxRef,
      };
    } else {
      notificationData = {
        KitchenId: userData.Id,
        Title: userData.KitchenName,
        UserId: currentOrder.UserId,
        Message: messageInput,
        OrderId: currentOrder.TrxRef,
      };
    }
  
    const notificationResponse = await SendNotification(notificationData, auth);
  
    if (notificationResponse && notificationResponse.code === 200) {
      message.success("Notification sent successfully");
      fetchOrders()
    } else {
      message.error("Notification wasn't sent");
    }
  
    setChatModalVisible(false);
  };  

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

  const fetchOrders = async () => {
    try {
      const fetchedOrdersResponse = await GetKitchenOrders(userData, auth);
      if (fetchedOrdersResponse.code === 200) {
        setFetchedOrders(fetchedOrdersResponse.body.Orders);
        const orders = fetchedOrdersResponse.body.Orders;

        const filteredOrdersForToday = orders.filter((order) => {
          const orderDate = moment(order.CreatedAt);
          return today === orderDate.date();
        });

        filteredOrdersForToday.forEach((order, index) => {
          order.OrderNumber = index + 1;
        });

        setOrderNumber(orderNumber + orders.length);
      }
    } catch (error) {
      message.error('Failed to fetch orders, check your internet connection');
    }
  };

  useEffect(() => {
    fetchOrders();
    // const intervalId = setInterval(fetchOrders, 2000);
    // return () => clearInterval(intervalId);
  }, []);

  const handleDoneAndPackagedButtonClick = async () => {
    if (currentOrder.IsAttended) {
      // console.log('This order has already been attended.');
      return;
    }
  
    setDoneAndPackagedOrders((prevDoneAndPackagedOrders) => [
      ...prevDoneAndPackagedOrders,
      currentOrder.TrxRef,
    ]);
  
    let notificationData;
  
    if (userData && userData.Role === 'basic') {
      notificationData = {
        KitchenId: userData.KitchenId,
        Title: `${userData.FirstName} (staff)`,
        UserId: currentOrder.UserId,
        Message: `Your order with ID ${currentOrder.TrxRef} is done and packaged!. Come and pickup your food early so that it won't be cold. Thank you for using QuicKee`,
        OrderId: currentOrder.TrxRef,
      };
    } else {
      notificationData = {
        KitchenId: userData.Id,
        Title: `${userData.KitchenName} - Order Done and Packaged`,
        UserId: currentOrder.UserId,
        Message: `Your order with ID ${currentOrder.TrxRef} is done and packaged!. Come and pickup your food early so that it won't be cold. Thank you for using QuicKee`,
        OrderId: currentOrder.TrxRef,
      };
    }
  
    const notificationResponse = await SendNotification(notificationData, auth);
  
    if (notificationResponse && notificationResponse.code === 200) {
      message.success("Notification sent successfully");
      fetchOrders()
    } else {
      message.error("Notification wasn't sent");
    }
  };
  
  const ordersPerPage = 8;

  const handleNextPage = () => {
    setCurrentOrderIndex(currentOrderIndex + ordersPerPage);
  };

  const handlePrevPage = () => {
    setCurrentOrderIndex(Math.max(0, currentOrderIndex - ordersPerPage));
  };

  return (
    <div style={{ marginLeft: '7rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {filteredOrders.length > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Input.Search
              placeholder="Search Order ID"
              value={searchQuery}
              onChange={handleInputChange}
              style={{ width: '20rem', marginRight: '10px' }}
              allowClear
            />
            <Select
              style={{ width: '150px' }}
              placeholder="Filter"
              onChange={handleAttendedFilterChange}
            >
              <Select.Option value="attended">Attended</Select.Option>
              <Select.Option value="unattended">Unattended</Select.Option>
            </Select>
          </div>
        )}

      {filteredOrders.length > 0 ? (
        <><Collapse accordion style={{ width: '60rem', marginTop: '10px', marginLeft: '50px' }}>
          {filteredOrders
            .slice(currentOrderIndex, currentOrderIndex + ordersPerPage)
            .filter((order) => order.TrxRef.toString().includes(searchQuery) &&
              (attendedFilter === null || order.IsAttended === (attendedFilter === 'attended'))
            )
            .map((order) => (
              <Panel
                key={order.TrxRef}
                header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Order {order.TrxRef} <br />
                  Order #{order.OrderNumber}
                  <ChatCircleDots
                    size={26}
                    color='green'
                    style={{ cursor: 'pointer' }}
                    onClick={handleChatIconClick} />
                  <span>
                    {order.IsAttended && (
                      <Tag color="green" style={{ marginLeft: '10px' }}>
                        Attended
                      </Tag>
                    )}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
                    {moment(order.CreatedAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                  </span>
                </div>}
              >
                <Card
                  style={cardStyle}
                >
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Order ID">{order.TrxRef}</Descriptions.Item>
                    <Descriptions.Item label="Customer Description">
                      {order.Description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Order Number">
                      #{order.OrderNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="PhoneNumber">
                      {order.UserPhone}
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider />
                  <List
                    dataSource={order.Items}
                    renderItem={(dishItem, index) => (
                      <List.Item key={index}>
                        <div style={{ fontWeight: 'bold' }}>
                          {dishItem.Name} x{dishItem.Scoops}
                        </div>
                        <div>₦{dishItem.Price}</div>
                      </List.Item>
                    )} />
                  <Divider />
                  <div style={styles.totalSum}>
                    <h2>Total:</h2>
                    <h2 style={styles.totalPrice}>₦{order.TotalAmount}</h2>
                  </div>
                  <Divider />
                  <div style={styles.buttonContainer}>
                    {!attendedOrders.includes(order.TrxRef) && (
                      !doneAndPackagedOrders.includes(order.TrxRef) && !order.IsAttended && (
                        <Button
                          style={styles.seeNextButton}
                          onClick={() => handleDoneAndPackagedButtonClick(order)}
                        >
                          Done and Packaged
                        </Button>
                      )
                    )}
                  </div>
                  <Modal
                    title="Send this user a message"
                    open={isChatModalVisible}
                    onCancel={handleModalCancel}
                    footer={[
                      <Button key="cancel" onClick={handleModalCancel}>
                        Cancel
                      </Button>,
                      <Button key="send" type="primary" onClick={handleSendMessage}>
                        Send
                      </Button>,
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      value={messageInput}
                      onChange={handleInputChange}
                      placeholder="Type your message here..." />
                  </Modal>
                </Card>
              </Panel>
            ))}
        </Collapse>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Button onClick={handlePrevPage} disabled={currentOrderIndex === 0}>
              Previous Page
            </Button>
            <Button onClick={handleNextPage} disabled={currentOrderIndex + ordersPerPage >= filteredOrders.length}>
              Next Page
            </Button>
        </div></>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '2rem', color: 'grey', marginRight: '7%', marginTop: '20%' }}>
          {filteredOrders.length === 0 ? 'No delicious orders have arrived just yet. The kitchen awaits its first culinary masterpiece! 🍔🍕🍝' : 'Loading...'}
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  margin: '1rem',
  width: '45rem',
  height: '740px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  alignItems: 'center',
  marginLeft: '6rem',
  // marginRight: '8rem',
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
    flexDirection: 'row',
    marginLeft: '10%'
  },
  seeNextButton: {
    // marginLeft: 'auto',
    marginRight: '10%',
    background: '#006400',
    borderColor: '#52c41a',
    color: 'white',
    width: '600px',
    height: '40px',
    marginLeft: '10px',
  },
};

export default Orders;