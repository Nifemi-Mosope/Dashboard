import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export function useMenuContext() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orders, setOrders] = useState([
    {
      orderId: "F23457",
      customer: 'Oluwanifemi Ojinni',
      description: 'How is the order going? send me a mail and we will get your problem resolved',
      dishes: [
        {
          dish: 'Jollof Rice',
          scoops: 2,
          price: 300,
        },
        {
          dish: 'Pepper Soup',
          scoops: 1,
          price: 1500,
        }
      ],
    },
    {
      orderId: 2,
      customer: 'Customer 2',
      description: 'Order 2 description',
      dishes: [
        {
          dish: 'Fried Rice',
          scoops: 1,
          price: 1800,
        },
      ],
    },
  ]);

  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const updateOrderStatus = (orderId, status) => {
    // Find the order to update
    const updatedOrders = orders.map((order) => {
      if (order.orderId === orderId) {
        return { ...order, status };
      }
      return order;
    });

    setOrders(updatedOrders);

    // Move to order history if the status is "attended" or "cancelled"
    if (status === 'Attended' || status === 'Cancelled') {
      const orderToMove = orders.find((order) => order.orderId === orderId);
      setOrderHistory([...orderHistory, orderToMove]);
    }
  };

  return (
    <MenuContext.Provider value={{ isModalVisible, openModal, closeModal, orders, addOrder, orderHistory, updateOrderStatus }}>
      {children}
    </MenuContext.Provider>
  );
}