import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Descriptions,
  Divider,
  List,
  Button,
  Modal,
  message,
  Tag,
  Input,
  Collapse,
  Select,
  notification,
} from "antd";
import { useMenuContext } from "../Menus/MenuContext";
import moment from "moment";
import {
  GetKitchenOrders,
  SendNotification,
} from "../../../Features/Kitchen/KitchenSlice";
import { ChatCircleDots } from "phosphor-react";
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
  const [messageInput, setMessageInput] = useState("");
  const [orderNumber, setOrderNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendedFilter, setAttendedFilter] = useState(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const handleAttendedFilterChange = (value) => {
    setAttendedFilter(value);
  };

  const currentDate = moment();
  const today = currentDate.date();

  const filteredOrders = fetchedOrders.filter((order) => {
    const orderDate = moment(order.CreatedAt);
    return today === orderDate.date() && order.IsPaid === true;
  });

  const currentOrder = filteredOrders[currentOrderIndex];

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
    const updatedOrder = {
      ...currentOrder,
      IsAttended: false,
    };

    let notificationData;

    if (userData && userData.Role === "basic") {
      notificationData = {
        KitchenId: userData.KitchenId,
        Title: `${userData.FirstName} (staff)`,
        UserId: updatedOrder.UserId,
        Message: messageInput,
        OrderId: updatedOrder.TrxRef,
      };
    } else {
      notificationData = {
        KitchenId: userData.Id,
        Title: userData.KitchenName,
        UserId: updatedOrder.UserId,
        Message: messageInput,
        OrderId: updatedOrder.TrxRef,
      };
    }

    const notificationResponse = await SendNotification(notificationData, auth);

    if (notificationResponse && notificationResponse.code === 200) {
      message.success("Notification sent successfully");
      // Fetch updated orders from the server
      fetchOrders();
    } else {
      message.error("Notification wasn't sent");
    }

    setChatModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          try {
            const parsedOrders = JSON.parse(storedOrders);
            setOrders(parsedOrders);
          } catch (error) {
            console.error("Failed to parse stored orders:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchData();
  }, []);

  const fetchOrders = async () => {
    try {
      if (auth) {
        const fetchedOrdersResponse = await GetKitchenOrders(userData, auth);
        // console.log(fetchedOrdersResponse)
        if (fetchedOrdersResponse && fetchedOrdersResponse.code === 200) {
          setFetchedOrders(fetchedOrdersResponse.body.Orders);
          const orders = fetchedOrdersResponse.body.Orders;

          const sortedMenus = orders.sort((a, b) => {
            return (
              moment(b.CreatedAt).valueOf() - moment(a.CreatedAt).valueOf()
            );
          });

          const filteredOrdersForToday = sortedMenus.filter((order) => {
            const orderDate = moment(order.CreatedAt);
            return today === orderDate.date();
          });

          filteredOrdersForToday.forEach((order, index) => {
            order.OrderNumber = index + 1;
          });

          setOrderNumber(orderNumber + orders.length);
        }
      }
    } catch (error) {
      message.error("Failed to fetch orders, check your internet connection");
    }
  };

  useEffect(() => {
    // fetchOrders();
    const intervalId = setInterval(fetchOrders, 2000);
    return () => clearInterval(intervalId);
  }, [auth]);

  const handleDoneAndPackagedButtonClick = async () => {
    if (currentOrder.IsAttended) {
      // console.log('This order has already been attended.');
      return;
    }

    // const updatedOrders = fetchedOrders.map((order) =>
    //   order.TrxRef === currentOrder.TrxRef
    //     ? { ...order, IsAttended: true }
    //     : order
    // );

    setDoneAndPackagedOrders((prevDoneAndPackagedOrders) => [
      ...prevDoneAndPackagedOrders,
      currentOrder.TrxRef,
    ]);

    // setFetchedOrders(updatedOrders);

    let notificationData;

    if (userData && userData.Role === "basic") {
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
      fetchOrders();
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

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {});
    }
  };

  const animateAudio = () => {
    playAudio();
    animationRef.current = requestAnimationFrame(animateAudio);
  };

  useEffect(() => {
    const storedLatestOrderTimestamp = localStorage.getItem(
      "latestOrderTimestamp"
    );
    const latestOrderTimestamp = storedLatestOrderTimestamp
      ? parseInt(storedLatestOrderTimestamp)
      : 0;

    // Sort the orders by creation time in descending order
    const sortedOrders = [...filteredOrders].sort(
      (a, b) => moment(b.CreatedAt).unix() - moment(a.CreatedAt).unix()
    );

    const currentOrder = sortedOrders[currentOrderIndex];

    const isNewOrder =
      currentOrder &&
      moment(currentOrder.CreatedAt).unix() > latestOrderTimestamp;

    if (isNewOrder) {
      // Trigger Notification
      notification.info({
        message: "New Order!",
        description: `Order #${currentOrder.TrxRef} has been received.`,
        duration: 0,
        onClose: () => {
          // Stop audio and animation when the notification is closed
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        },
      });

      const audio = new Audio("/message_tone.mp3");
      audio.loop = true; // Set the loop property to true

      // Assign the audio element to the ref
      audioRef.current = audio;

      // Start continuous audio playback
      animateAudio();

      // Update LocalStorage with the latest timestamp
      localStorage.setItem(
        "latestOrderTimestamp",
        moment(currentOrder.CreatedAt).unix().toString()
      );
    }
  }, [filteredOrders, currentOrderIndex]);

  return (
    <div
      style={{
        marginLeft: "7rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {filteredOrders.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Input.Search
            placeholder="Search Order ID"
            value={searchQuery}
            onChange={handleInputChange}
            style={{ width: "20rem", marginRight: "10px" }}
            allowClear
          />
          <Select
            style={{ width: "150px" }}
            placeholder="Filter"
            onChange={handleAttendedFilterChange}
          >
            <Select.Option value="attended">Attended</Select.Option>
            <Select.Option value="unattended">Unattended</Select.Option>
          </Select>
        </div>
      )}

      {filteredOrders.length > 0 ? (
        <>
          <Collapse
            accordion
            style={{ width: "60rem", marginTop: "10px", marginLeft: "50px" }}
          >
            {filteredOrders
              .slice(currentOrderIndex, currentOrderIndex + ordersPerPage)
              .filter(
                (order) =>
                  order.TrxRef.toString().includes(searchQuery) &&
                  (attendedFilter === null ||
                    order.IsAttended === (attendedFilter === "attended"))
              )
              .map((order, index) => (
                <Panel
                  key={order.TrxRef}
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      OrderID {order.TrxRef} <br />
                      Order #{filteredOrders.length - index}
                      <ChatCircleDots
                        size={26}
                        color="green"
                        style={{ cursor: "pointer" }}
                        onClick={handleChatIconClick}
                      />
                      <span>
                        {order.IsAttended && (
                          <Tag color="green" style={{ marginLeft: "10px" }}>
                            Attended
                          </Tag>
                        )}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: "14px" }}>
                        {moment(order.CreatedAt).format(
                          "dddd, MMMM Do YYYY, h:mm:ss a"
                        )}
                      </span>
                    </div>
                  }
                >
                  <Card style={cardStyle}>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Order ID">
                        {order.TrxRef}
                      </Descriptions.Item>
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
                          <div style={{ fontWeight: "bold" }}>
                            {dishItem.Name} x{dishItem.Scoops}
                          </div>
                          <div>₦{dishItem.Price}</div>
                        </List.Item>
                      )}
                    />
                    <Divider />
                    <div style={styles.totalSum}>
                      <h2>Total:</h2>
                      <h2 style={styles.totalPrice}>₦{order.TotalAmount}</h2>
                    </div>
                    <Divider />
                    <div style={styles.buttonContainer}>
                      {!attendedOrders.includes(order.TrxRef) &&
                        !doneAndPackagedOrders.includes(order.TrxRef) &&
                        !order.IsAttended && (
                          <Button
                            style={styles.seeNextButton}
                            onClick={() =>
                              handleDoneAndPackagedButtonClick(order)
                            }
                          >
                            Done and Packaged
                          </Button>
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
                        <Button
                          key="send"
                          type="primary"
                          onClick={handleSendMessage}
                        >
                          Send
                        </Button>,
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        value={messageInput}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                      />
                    </Modal>
                  </Card>
                </Panel>
              ))}
          </Collapse>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Button onClick={handlePrevPage} disabled={currentOrderIndex === 0}>
              Previous Page
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={
                currentOrderIndex + ordersPerPage >= filteredOrders.length
              }
            >
              Next Page
            </Button>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            fontSize: "2rem",
            color: "grey",
            marginRight: "7%",
            marginTop: "20%",
          }}
        >
          {filteredOrders.length === 0
            ? "No delicious orders have arrived just yet. The kitchen awaits its first culinary masterpiece! 🍔🍕🍝"
            : "Loading..."}
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  margin: "1rem",
  width: "45rem",
  height: "740px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  alignItems: "center",
  marginLeft: "6rem",
  // marginRight: '8rem',
};

const descriptionStyle = {
  whiteSpace: "pre-wrap",
  maxWidth: "300px",
};

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
    flexDirection: "row",
    marginLeft: "10%",
  },
  seeNextButton: {
    // marginLeft: 'auto',
    marginRight: "10%",
    background: "#006400",
    borderColor: "#52c41a",
    color: "white",
    width: "600px",
    height: "40px",
    marginLeft: "10px",
  },
};

export default Orders;
