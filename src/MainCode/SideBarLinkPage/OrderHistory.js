import React, { useState } from 'react';
import { Card, Table, Tag, Input, Modal } from 'antd';
import { useMenuContext } from './MenuContext';

function History() {
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {orderHistory} = useMenuContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  const orders = [
    {
      "orderID": "R5678",
      "foodDetails": [
        {
          "dish": "Jollof Rice",
          "scoops": 2,
          "price": 200,
        },
        {
          "dish": "Fried Rice",
          "scoops": 1,
          "price": 150,
        },
        {
          "dish": "Yoghurt",
          "scoops": 3,
          "price": 50,
        },
        {
          "dish": "Beans",
          "scoops": 2,
          "price": 100,
        },
      ],
      "description": "Nil",
      "status": "Cancelled",
      "date": "Wed, 18th December 2023"
    },
    {
      "orderID": "Y8585",
      "foodDetails": [
        {
          "dish": "Jollof Rice",
          "scoops": 2,
          "price": 200,
        },
        {
          "dish": "Fried Rice",
          "scoops": 1,
          "price": 150,
        },
        {
          "dish": "Yoghurt",
          "scoops": 3,
          "price": 50,
        },
        {
          "dish": "Beans",
          "scoops": 2,
          "price": 100,
        },
      ],
      "description": "Put the Beans in the nylon",
      "status": "Cancelled",
      "date": "Wed, 18th December 2023"
    },
    {
      "orderID": "U8985",
      "foodDetails": [
        {
          "dish": "Jollof Rice",
          "scoops": 2,
          "price": 200,
        },
        {
          "dish": "Fried Rice",
          "scoops": 1,
          "price": 150,
        },
        {
          "dish": "Yoghurt",
          "scoops": 3,
          "price": 50,
        },
        {
          "dish": "Beans",
          "scoops": 2,
          "price": 100,
        },
      ],
      "description": "Put the Beans in the nylon",
      "status": "Cancelled",
      "date": "Wed, 18th December 2023"
    }
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const ordersToDisplay = orders.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderOrderStatus = (orderStatus) => {
    const color = orderStatus === 'Attended' ? 'green' : 'red';
    return <Tag color={color}>{orderStatus}</Tag>;
  };

  const tableColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID'
    },
    {
      title: 'Food Details',
      dataIndex: 'foodDetails',
      key: 'foodDetails',
      render: (foodDetails) => (
        <ul>
          {foodDetails.map((foodItem, index) => (
            <li key={index}>
              {foodItem.dish} x{foodItem.scoops} (₦{foodItem.price.toFixed(2)})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderOrderStatus
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      render: (text, record) => (
        `₦${record.foodDetails.reduce((total, foodItem) => total + (foodItem.price * foodItem.scoops), 0).toFixed(2)}`
      ),
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.orderID.toLowerCase().includes(searchText.toLowerCase())
  );

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
        style={{ width: '20rem', marginLeft: '87%', marginTop: '1rem' }}
        allowClear
      />
      <Card title={"Order History"} style={{ margin: 20, width: '120%' }}>
        <Table
          dataSource={filteredOrders}
          columns={tableColumns}
          rowKey={"orderID"}
          onRow={(record) => ({
            onClick: () => handleOrderClick(record),
          })}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: orders.length,
            onChange: handlePageChange,
          }}
        />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder ? selectedOrder.orderID : ''}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p>Order ID: {selectedOrder.orderID}</p>
            <p>Description: {selectedOrder.description}</p>
            <p>Food Details:</p>
            <ul>
              {selectedOrder.foodDetails.map((foodItem, index) => (
                <li key={index}>
                  {foodItem.dish} x{foodItem.scoops} (₦{foodItem.price.toFixed(2)})
                </li>
              ))}
            </ul>
            <p>Status: {renderOrderStatus(selectedOrder.status)}</p>
            <p>Total Price: ₦
              {(
                selectedOrder.foodDetails.reduce(
                  (total, foodItem) => total + foodItem.price * foodItem.scoops,
                  0
                )
              ).toFixed(2)}
            </p>
            <p>Date: {selectedOrder.date}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default History;
