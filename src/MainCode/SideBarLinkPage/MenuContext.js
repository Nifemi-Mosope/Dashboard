import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export function useMenuContext() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const storedUserData = localStorage.getItem('userData');
  const initialUserData = storedUserData ? JSON.parse(storedUserData) : null;

  const storedAuthData = localStorage.getItem('auth');
  const initialAuth = storedAuthData ? JSON.parse(storedAuthData) : null;

  const storedMenus = localStorage.getItem('menus');
  const initialMenus = storedMenus ? JSON.parse(storedMenus) : null;

  const storedStaff = localStorage.getItem('staffs');
  const initialStaff = storedStaff ? JSON.parse(storedStaff) : null;

  const storedImage = localStorage.getItem('Image');
  const initialImage = storedImage ? JSON.parse(storedImage) : null;

  const storedOrders = localStorage.getItem('fetchedOrders');
  const initialOrders = storedOrders ? JSON.parse(storedOrders) : null;

  const [userData, setUserData] = useState(initialUserData);
  const [auth, setAuth] = useState(initialAuth);
  const [menus, setMenus] = useState(initialMenus);
  const [staffs, setStaffs] = useState(initialStaff); 
  const [image, setImage] = useState(initialImage);
  const [fetchedOrders, setFetchedOrders] = useState(initialOrders);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const setUser = (body) => {
    setUserData(body);
  };

  const removeOrderAndAddToHistory = (order) => {
    setCurrentOrders((prevOrders) => prevOrders.filter((prevOrder) => prevOrder !== order));
    setOrderHistory((prevHistory) => [...prevHistory, order]);
  };

  const updateOrderHistory = (newOrder) => {
    setOrderHistory((prevOrderHistory) => [...prevOrderHistory, newOrder]);
  };

  const addToOrderHistory = (order) => {
    setOrderHistory((prevOrderHistory) => [...prevOrderHistory, order]);
  };

  return (
    <MenuContext.Provider value={{ isModalVisible, openModal, closeModal, orderHistory, currentOrders, removeOrderAndAddToHistory, userData, setUser, auth, setAuth, menus, setMenus, staffs, setStaffs, image, setImage, fetchedOrders, setFetchedOrders, updateOrderHistory, addToOrderHistory }}>
      {children}
    </MenuContext.Provider>
  );
}