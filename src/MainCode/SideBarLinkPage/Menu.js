import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag, Form, Modal, Select, Alert, Spin } from 'antd';
import { useMenuContext } from './MenuContext';
const { Column } = Table;
const { Search } = Input;

const initialMenuItems = [
  {
    key: '1',
    foodName: 'Jollof Rice',
    foodPrice: 1500,
    foodQuantity: 10,
    foodStatus: 'available',
    foodCategory: 'Food',
    foodClass: 'Rice',
  },
  {
    key: '2',
    foodName: 'Fried Rice',
    foodPrice: 2000,
    foodQuantity: 8,
    foodStatus: 'available',
    foodCategory: 'Food',
    foodClass: 'Rice',
  },
  {
    key: '3',
    foodName: 'Chicken',
    foodPrice: 1000,
    foodQuantity: 0,
    foodStatus: 'finished',
    foodCategory: 'Food',
    foodClass: 'Proteins',
  },
  {
    key: '4',
    foodName: 'Beans',
    foodPrice: 1000,
    foodQuantity: 40,
    foodStatus: 'available',
    foodCategory: 'Food',
    foodClass: 'Beans',
  },
];

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const { isModalVisible, openModal, closeModal } = useMenuContext();
  const [formValues, setFormValues] = useState(null);
  const [newMenuAlertVisible, setNewMenuAlertVisible] = useState(false);
  const [editMenuAlertVisible, setEditMenuAlertVisible] = useState(false);
  const [deleteMenuAlertVisible, setDeleteMenuAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleFormSubmit = (values) => {
    setLoading(true);

    setTimeout(() => {
      setFormValues(values);
      closeModal();
      if (editItem) {
        const updatedMenuItems = menuItems.map((item) => {
          if (item.key === editItem.key) {
            return {
              ...item,
              foodPrice: values.foodPrice,
              foodQuantity: values.foodQuantity,
              foodStatus: values.foodQuantity > 0 ? 'available' : 'finished',
            };
          }
          return item;
        });
        setMenuItems(updatedMenuItems);
        setEditItem(null);
        setEditMenuAlertVisible(true);
      } else {
        const newMenuItem = {
          key: (menuItems.length + 1).toString(),
          ...values,
          foodStatus: values.foodQuantity > 0 ? 'available' : 'finished',
        };
        setMenuItems([...menuItems, newMenuItem]);
        setNewMenuAlertVisible(true);
      }
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this menu item?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: {
        type: 'danger',
      },
      onOk: () => {
        const updatedMenuItems = menuItems.filter((item) => item.key !== record.key);
        setMenuItems(updatedMenuItems);
        setDeleteMenuAlertVisible(true);
      },
    });
  };

  const handleEditFormSubmit = (values) => {
    setEditModalVisible(false);
    setEditItem(null);
    handleFormSubmit(values);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.foodName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
        <h1 style={{ fontFamily: 'sans-serif, OpenSans', marginTop: '1rem' }}>Menus</h1>
        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>
          <Search
          placeholder="Search for menus"
          style={{ width: '20rem', marginRight: '1rem', marginTop: '1rem' }}
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" style={{ marginLeft: 'auto', marginTop: '1rem' }} onClick={openModal}>
            Add a new menu
          </Button>
        </div>
      </div>
      <Table dataSource={filteredMenuItems} style={{ width: '60rem', marginLeft: '5rem' }}>
        <Column title="Food Name" dataIndex="foodName" key="foodName" />
        <Column title="Food Category" dataIndex="foodCategory" key="foodCategory" />
        <Column title="Food Price (Naira)" dataIndex="foodPrice" key="foodPrice" />
        <Column title="Food Quantity" dataIndex="foodQuantity" key="foodQuantity" />
        <Column title="Food Class" dataIndex="foodClass" key="foodClass" />

        <Column
          title="Food Status"
          dataIndex="foodStatus"
          key="foodStatus"
          render={(status) => (
            <Tag color={status === 'available' ? 'green' : 'red'}>{status}</Tag>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => handleEdit(record)}>
                Edit
              </Button>
              <Button type="danger" onClick={() => handleDelete(record)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Add a new menu"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          onFinish={handleFormSubmit}
          initialValues={{
            foodName: '',
            foodCategory: undefined,
            foodClass: undefined,
            foodPrice: undefined,
            foodQuantity: undefined,
            foodStatus: undefined,
          }}
        >
          <Form.Item
            label="Food Name"
            name="foodName"
            rules={[
              {
                required: true,
                message: 'Please input the name of your food',
              },
            ]}
          >
            <div>
              <Input
                type="text"
                placeholder="What is the name of your food?"
                style={{ width: '60%', height: '29px' }}
              />
            </div>
          </Form.Item>
          <Form.Item
            label=" Category"
            name="foodCategory"
            rules={[
              {
                required: true,
                message: 'Please select a category',
              },
            ]}
          >
            <Select style={{ width: '60%' }}>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Snacks">Snacks</Select.Option>
              <Select.Option value="Drinks">Drinks</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Food Class"
            name="foodClass"
            rules={[
              {
                required: true,
                message: 'Please select a class',
              },
            ]}
          >
            <Select style={{ width: '60%' }}>
              <Select.Option value="Rice">Rice</Select.Option>
              <Select.Option value="Beans">Beans</Select.Option>
              <Select.Option value="Yam">Yam</Select.Option>
              <Select.Option value="Protein">Protein</Select.Option>
              <Select.Option value="Dessert">Dessert</Select.Option>
              <Select.Option value="Others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Food Price (Naira)"
            name="foodPrice"
            rules={[
              {
                required: true,
                message: 'Please input the price of your food',
              },
            ]}
          >
            <div style={{ width: '60%' }}>
              <Input
                placeholder="input price"
                type="number"
                style={{ height: '45px', bottom: '10px' }}
              />
            </div>
          </Form.Item>
          <Form.Item
            label="Food Quantity"
            name="foodQuantity"
            rules={[
              {
                required: true,
                message: 'Please input the quantity of your food',
              },
            ]}
          >
            <div style={{ width: '60%' }}>
              <Input
                placeholder="input quantity"
                style={{ height: '45px', bottom: '10px' }}
                type="number"
              />
            </div>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: '20rem',
              width: '10rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            loading={loading}
          >
            Add
          </Button>
        </Form>
      </Modal>
      {newMenuAlertVisible && (
        <Alert
          message="Menu Item Added successfully"
          type="success"
          showIcon
          style={{ marginTop: '20px' }}
          closable
          onClose={() => setNewMenuAlertVisible(false)}
        />
      )}
      {editMenuAlertVisible && (
        <Alert
          message="Menu Item Edited successfully"
          type="success"
          showIcon
          style={{ marginTop: '20px' }}
          closable
          onClose={() => setEditMenuAlertVisible(false)}
        />
      )}
      {deleteMenuAlertVisible && (
        <Alert
          message="Menu Item Deleted successfully"
          type="success"
          showIcon
          style={{ marginTop: '20px' }}
          closable
          onClose={() => setDeleteMenuAlertVisible(false)}
        />
      )}
      {/* Edit Modal */}
      <Modal
        title="Edit Menu Item"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditItem(null);
        }}
        footer={null}
      >
        <Form
          onFinish={handleEditFormSubmit}
          initialValues={{
            foodName: '',
            foodPrice: undefined,
            foodQuantity: undefined,
            ...editItem,
          }}
        >
          <Form.Item
            label="Food Price (Naira)"
            name="foodPrice"
            rules={[
              {
                required: true,
                message: 'Please input the price of your food',
              },
            ]}
          >
            <div style={{ width: '60%' }}>
              <Input
                placeholder="input price"
                type="number"
                style={{ height: '45px', bottom: '10px' }}
              />
            </div>
          </Form.Item>
          <Form.Item
            label="Food Quantity"
            name="foodQuantity"
            rules={[
              {
                required: true,
                message: 'Please input the quantity of your food',
              },
            ]}
          >
            <div style={{ width: '60%' }}>
              <Input
                placeholder="input quantity"
                style={{ height: '45px', bottom: '10px' }}
                type="number"
              />
            </div>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: '20rem',
              width: '10rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            loading={loading}
          >
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuScreen;
