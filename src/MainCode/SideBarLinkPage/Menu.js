import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag, Form, Modal, Select } from 'antd';
import { useMenuContext } from './MenuContext';
const { Column } = Table;

const initialMenuItems = [
  {
    key: '1',
    foodName: 'Jollof Rice',
    foodPrice: 1500,
    foodQuantity: 10,
    foodStatus: 'available',
    foodCategory: 'Rice'
  },
  {
    key: '2',
    foodName: 'Fried Rice',
    foodPrice: 2000,
    foodQuantity: 8,
    foodStatus: 'available',
    foodCategory: 'Rice'
  },
  {
    key: '3',
    foodName: 'Chicken',
    foodPrice: 1000,
    foodQuantity: 0,
    foodStatus: 'finished',
    foodCategory: 'Protein'
  },
  {
    key: '4',
    foodName: 'Beans',
    foodPrice: 1000,
    foodQuantity: 40,
    foodStatus: 'available',
    foodCategory: 'Beans'
  },
  {
    key: '5',
    foodName: 'Beans',
    foodPrice: 1000,
    foodQuantity: 40,
    foodStatus: 'available',
    foodCategory: 'Beans'
  },
  {
    key: '6',
    foodName: 'Beans',
    foodPrice: 1000,
    foodQuantity: 40,
    foodStatus: 'available',
    foodCategory: 'Beans'
  }
];

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const { isModalVisible, openModal, closeModal } = useMenuContext();
  const [formValues, setFormValues] = useState(null);

  const handleFormSubmit = (values) => {
    setFormValues(values);
    console.log('Form values:', values);
    closeModal();
  };

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto'}}>
        <h1 style={{fontFamily: 'sans-serif, OpenSans', marginTop: '1rem'}}>Menus</h1>
        <Button type='primary' style={{marginLeft: 'auto', marginTop: '1rem'}} onClick={openModal}>
          Add a new menu
        </Button>
      </div>
      <Table dataSource={menuItems} style={{width: '60rem', marginLeft: '5rem'}}>
        <Column title="Food Name" dataIndex="foodName" key="foodName" />
        <Column title="Food Category" dataIndex="foodCategory" key="foodCategory" />
        <Column title="Food Price (Naira)" dataIndex="foodPrice" key="foodPrice" />
        <Column title="Food Quantity" dataIndex="foodQuantity" key="foodQuantity" />
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
              <Button type="primary">Edit</Button>
              <Button type="danger">Delete</Button>
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
        <Form onFinish={handleFormSubmit}>
            <Form.Item label="Food Name" name="foodName">
              <Input 
                placeholder='What is the name of your food?'
              />
            </Form.Item>
          <Form.Item label="Food Category" name="foodCategory">
            <Select>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Snacks">Snacks</Select.Option>
              <Select.Option value="Drinks">Drinks</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Food Class" name="foodClass">
              <Select>
                <Select.Option value="Rice">Rice</Select.Option>
                <Select.Option value="Beans">Beans</Select.Option>
                <Select.Option value="Yam">Yam</Select.Option>
                <Select.Option value="Protein">Protein</Select.Option>
                <Select.Option value="Dessert">Dessert</Select.Option>
                <Select.Option value="Others">Others</Select.Option>
              </Select>
          </Form.Item>
          <Form.Item label="Food Price (Naira)" name="foodPrice">
            <Input 
              placeholder='input the price of your food'
            />
          </Form.Item>
          <Form.Item label="Food Quantity" name="foodQuantity">
            <Input 
              placeholder='How many of this food do you have?'
            />
          </Form.Item>
          <Form.Item label="Food Status" name="foodStatus">
          <Select>
              <Select.Option value="Available">Available</Select.Option>
              <Select.Option value="Finished">Finished</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{marginLeft: '20rem', width: '10rem'}}>
            Add
          </Button>
        </Form>
      </Modal>
      <pre style={{ marginTop: '20px' }}>
        {formValues && JSON.stringify(formValues, null, 2)}
      </pre>
    </div>
  );
};

export default MenuScreen;
