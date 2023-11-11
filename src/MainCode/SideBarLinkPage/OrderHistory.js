import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Input, Modal } from 'antd';
import { useMenuContext } from './MenuContext';
import { GetKitchenOrders } from '../Features/KitchenSlice';

function History() {
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, auth } = useMenuContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [filteredKitchenOrders, setFilteredKitchenOrders] = useState([]);

  const fetchKitchenOrders = async () => {
    try {
      const response = await GetKitchenOrders(userData, auth);
      if (response.code === 200) {
        setKitchenOrders(response.body.Orders);
        setFilteredKitchenOrders(response.body.Orders);
      }
    } catch (error) {
      console.error('Failed to fetch kitchen orders', error);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
  }, [userData.KitchenEmail, auth]);

  const handleSearch = () => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = kitchenOrders.filter(order =>
      order.TrxRef.toLowerCase().includes(lowerSearchText)
    );
    setFilteredKitchenOrders(filtered);
  };

  useEffect(() => {
    if (searchText) {
      handleSearch();
    } else {
      setFilteredKitchenOrders(kitchenOrders);
    }
  }, [searchText, kitchenOrders]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderOrderStatus = (orderStatus) => {
    const color = orderStatus === 'Attended' ? 'green' : 'red';
    return <Tag color={color}>{orderStatus}</Tag>;
  };

  const renderOrderDate = (date) => {
    const orderDate = new Date(date);
    return orderDate.toDateString();
  }

  const tableColumns = [
    {
      title: 'Order ID',
      dataIndex: 'TrxRef',
      key: 'TrxRef',
    },
    {
      title: 'Food Details',
      dataIndex: 'Items',
      key: 'Items',
      render: (foodDetails) => (
        <ul>
          {foodDetails && foodDetails.map((foodItem, index) => (
            <li key={index}>
              {foodItem.Name} x{foodItem.Scoops} (₦{foodItem.Price})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderOrderStatus,
    },
    {
      title: 'Date',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (text, record) => renderOrderDate(text),
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
      render: (text, record) => (
        `₦${text}`
      )
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ marginLeft: '5%' }}>
      <Input.Search
        placeholder="Search Order ID"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={handleSearch}
        style={{ width: '20rem', marginLeft: '73%', marginTop: '1rem' }}
        allowClear
      />
      <Card title={"Order History"} style={{ margin: 20, width: '65rem', marginLeft: '3rem' }}>
        <Table
          dataSource={filteredKitchenOrders}
          columns={tableColumns}
          rowKey={"TrxRef"}
          onRow={(record) => ({
            onClick: () => handleOrderClick(record),
          })}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredKitchenOrders.length,
            onChange: handlePageChange,
          }}
        />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder ? selectedOrder.TrxRef : ''}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p>Order ID: {selectedOrder.TrxRef}</p>
            <p>Description: {selectedOrder.Description}</p>
            <p>Food Details:</p>
            <ul>
              {selectedOrder.Items.map((foodItem, index) => (
                <li key={index}>
                  {foodItem.Name} x{foodItem.Scoops} (₦{foodItem.Price})
                </li>
              ))}
            </ul>
            <p>Status: {renderOrderStatus(selectedOrder.status)}</p>
            <p>Total Price: ₦{selectedOrder.TotalAmount}</p>
            <p>Date: {selectedOrder.CreatedAt}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default History;