import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Input, Modal, message } from 'antd';
import { useMenuContext } from '../Menus/MenuContext';
import { GetKitchenOrders } from '../../Features/KitchenSlice';
import { Printer } from 'phosphor-react';

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
        const orders = response.body.Orders;
  
        const paidOrders = orders.filter(order => order.IsPaid === true);
  
        const sortedOrders = paidOrders.sort((a, b) => {
          const dateA = new Date(a.CreatedAt);
          const dateB = new Date(b.CreatedAt);
          return dateB - dateA;
        });
  
        setKitchenOrders(sortedOrders);
        setFilteredKitchenOrders(sortedOrders);
      }
    } catch (error) {
      message.error('Failed to fetch kitchen orders');
    }
  };
  
  
  useEffect(() => {
    fetchKitchenOrders();
  }, [userData.KitchenEmail, auth]);

  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      const dateA = new Date(a.CreatedAt);
      const dateB = new Date(b.CreatedAt);
      return dateB - dateA;
    });
  };
  
  const handleSearch = () => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = kitchenOrders.filter((order) =>
      order.TrxRef.toLowerCase().includes(lowerSearchText)
    );
    const sortedFilteredOrders = sortOrders(filtered);
    setFilteredKitchenOrders(sortedFilteredOrders);
  };
  
  useEffect(() => {
    if (searchText) {
      handleSearch();
    } else {
      const sortedOrders = sortOrders(kitchenOrders);
      setFilteredKitchenOrders(sortedOrders);
    }
  }, [searchText, kitchenOrders]);  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderOrderStatus = (orderStatus, isPaid) => {
    const color = orderStatus === 'Attended' ? 'green' : 'red';
    const statusTag = <Tag color={color}>{orderStatus}</Tag>;

    if (isPaid) {
      return (
        <>
          {statusTag}
          <Tag color="#006400">Paid</Tag>
        </>
      );
    }

    return (
      <>
        {statusTag}
        <Tag color="#FF0000">Not Paid/Pending</Tag>
      </>
    );
  };

  const renderOrderDate = (date) => {
    const orderDate = new Date(date);
  
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };
  
    return orderDate.toLocaleString(undefined, options);
  };

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
      render: (text, record) => renderOrderStatus(text, record.IsPaid),
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
    {
      title: 'Attended',
      dataIndex: 'IsAttended',
      key: 'IsAttended',
      render: (isAttended) => (
        <Tag color={isAttended ? 'green' : 'red'}>
          {isAttended ? 'Attended' : 'Not Attended'}
        </Tag>
      ),
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handlePrint = () => {
    if (selectedOrder) {
      const contentToPrint = `
        Order ID: ${selectedOrder.TrxRef} <br>
        Date: ${renderOrderDate(selectedOrder.CreatedAt)}
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
          </head>
          <body>
            ${contentToPrint}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
        <Printer onClick={handlePrint} style={{ cursor: 'pointer' }} size={50} color='green'/>
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
            <p>Status: {renderOrderStatus(selectedOrder.status, selectedOrder.IsPaid)}</p>
            <p>Total Price: ₦{selectedOrder.TotalAmount}</p>
            <p>Date: {renderOrderDate(selectedOrder.CreatedAt)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default History;