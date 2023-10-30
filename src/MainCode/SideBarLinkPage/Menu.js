import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Tag, Form, Modal, Select, Alert, message } from 'antd';
import { useMenuContext } from './MenuContext';
import { CreateMenu, UpdateMenu, DeleteMenu, GetKitchenMenus } from '../Features/KitchenSlice';

const { Column } = Table;
const { Search } = Input;

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { isModalVisible, openModal, closeModal, userData, auth, setMenus, menus } = useMenuContext();
  const [newMenuAlertVisible, setNewMenuAlertVisible] = useState(false);
  const [editMenuAlertVisible, setEditMenuAlertVisible] = useState(false);
  const [deleteMenuAlertVisible, setDeleteMenuAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [formData, setFormData] = useState({
    KitchenId: userData.Id,
    FoodName: '',
    Category: '',
    Class: '',
    TotalQuantity: '',
    Status: '',
    Price: ''
  });
  const [loadingMenus, setLoadingMenus] = useState(true)

  const fetchMenus = async () => {
    try {
      setLoadingMenus(true);
      const response = await GetKitchenMenus(userData, auth);
      if (response.code === 200) {
        setMenuItems(response.body);
      } else {
        message.error('Failed to fetch menus');
      }
      setLoadingMenus(false);
    } catch (error) {
      console.error(error);
      message.error('Internal Server Error', error);
      setLoadingMenus(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [userData.Id, auth]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const newValues = {
        ...formData,
        Status: formData.TotalQuantity > 0 ? 'available' : 'finished',
      };

      const response = await CreateMenu(newValues, auth);
      // console.log(response);

      if (response.code === 200) {
        if (editItem) {
          const updatedMenuItems = Array.isArray(menuItems)
            ? menuItems.map((item) => {
                if (item.key === editItem.key) {
                  return {
                    ...item,
                    Price: values.Price,
                    TotalQuantity: values.TotalQuantity,
                    Status: values.TotalQuantity > 0 ? 'available' : 'finished',
                  };
                }
                return item;
              })
            : [];
          setMenuItems(updatedMenuItems);
          setEditItem(null);
        } else {
          const newMenuItem = Array.isArray(menuItems)
            ? {
                key: response.body.Id,
                ...formData,
                Status: formData.TotalQuantity > 0 ? 'available' : 'finished',
              }
            : {};
          setMenuItems(Array.isArray(menuItems) ? [...menuItems, newMenuItem] : [newMenuItem]);
          message.success('Menu item created successfully.');
          console.log(response)
        }
        fetchMenus();
        closeModal();
        setMenus(response.body);
        localStorage.setItem('menus', JSON.stringify(response.body));
      } else {
        setLoading(false);
        message.error('Failed to create menu');
      }
    } catch (error) {
      // console.log(error);
      message.error('Internal Server Error', error);
    } finally {
      setLoading(false);
    }
  }; 
       

  const handleEdit = (record) => {
    setEditItem(record);
    setEditModalVisible(true);
  };
  const menuId = menus ? menus.Id : null;

  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this menu item?',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: {
        type: 'danger',
      },
      onOk: async () => {
        try {
          const response = await DeleteMenu(auth, record);
          console.log(response)
          if (response.message === `FoodMenu with id ${menuId} has been deleted!`) {
            const updatedMenuItems = menuItems.filter((item) => item.key !== record.key);
            setMenuItems(updatedMenuItems);
  
            const updatedMenus = menus.filter((menu) => menu.Id !== record.key);
            setMenus(updatedMenus);
  
            localStorage.setItem('menus', JSON.stringify(updatedMenus));
  
            message.success('Menu item deleted successfully');
          }
          fetchMenus()
        } catch (error) {
          console.error(error);
        }
      },
    });
  };  
    
           
  const handleEditFormSubmit = async (values) => {
    setLoading(true);
    try {
      const newValues = {
        TotalQuantity: values.TotalQuantity,
        Price: values.Price,
        Status: values.TotalQuantity > 0 ? 'available' : 'finished',
      };
  
      const response = await UpdateMenu(newValues, auth, menus);
      if (response.code === 200) {
        const updatedMenuItems = menuItems.map((item) => {
          if (item.key === menus.key) {
            return {
              ...item,
              Price: values.Price,
              TotalQuantity: values.TotalQuantity,
              Status: values.TotalQuantity > 0 ? 'available' : 'finished',
            };
          }
          return item;
        });
        setMenuItems(updatedMenuItems);
        message.success('Menu item updated successfully.');
  
        setMenus(response.body);
        localStorage.setItem('menus', JSON.stringify(response.body));
      } else {
        console.error('Failed to update menu item');
      }
    } catch (error) {
      console.error(error);
      message.error('Internal Server Error', error);
    } finally {
      setLoading(false);
    };
  };
  

  const filteredMenuItems = menuItems ? menuItems.filter((item) =>
    item.FoodName && item.FoodName.toLowerCase().includes(searchText.toLowerCase())
  ) : [];


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

  return (
    <div style={{ marginLeft: '2%' }}>
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
        <Column title="Food Name" dataIndex="FoodName" key="FoodName" />
        <Column title="Food Category" dataIndex="Category" key="Category" />
        <Column title="Food Price (Naira)" dataIndex="Price" key="Price" />
        <Column title="Food Quantity" dataIndex="TotalQuantity" key="TotalQuantity" />
        <Column title="Food Class" dataIndex="Class" key="Class" />

        <Column
          title="Food Status"
          dataIndex="TotalQuantity"
          key="foodStatus"
          render={(quantity) => (
            <Tag color={quantity > 0 ? 'green' : 'red'}>
              {quantity > 0 ? 'available' : 'finished'}
            </Tag>
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
        <Form onFinish={handleFormSubmit}>
          <Form.Item name="FoodName">
            <div style={{ justifyContent: 'flex-start' }}>
              <label htmlFor="foodName">Food Name</label>
              <input
                type="text"
                id="FoodName"
                name="FoodName"
                placeholder="Input food name"
                style={{ width: '70%', height: '10px', borderRadius: 5 }}
                value={formData.FoodName}
                onChange={handleInputChange}
                required
              />
            </div>
          </Form.Item>
          <Form.Item
            label="Category"
            name="Category"
            rules={[
              {
                required: true,
                message: 'Please select a category',
              },
            ]}
          >
            <Select style={{ width: '60%' }} onChange={(value) => setFormData({ ...formData, Category: value })}>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Snacks">Snacks</Select.Option>
              <Select.Option value="Drinks">Drinks</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Food Class"
            name="Class"
            rules={[
              {
                required: true,
                message: 'Please select a class',
              },
            ]}
          >
            <Select style={{ width: '60%' }} onChange={(value) => setFormData({ ...formData, Class: value })}>
              <Select.Option value="Rice">Rice</Select.Option>
              <Select.Option value="Beans">Beans</Select.Option>
              <Select.Option value="Yam">Yam</Select.Option>
              <Select.Option value="Protein">Protein</Select.Option>
              <Select.Option value="Dessert">Dessert</Select.Option>
              <Select.Option value="Others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="Price">
            <div style={{ justifyContent: 'flex-start' }}>
              <label>Food Price (Naira)</label>
              <input
                type="number"
                placeholder="Input food price"
                style={{ width: '70%', height: '10px', borderRadius: 5 }}
                name="Price"
                value={formData.Price}
                onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                required
              />
            </div>
          </Form.Item>
          <Form.Item name="TotalQuantity">
          <div style={{ justifyContent: 'flex-start' }}>
            <label>Food Quantity</label>
            <input
              type="number"
              placeholder="Input food quantity"
              style={{ width: '70%', height: '10px', borderRadius: 5 }}
              name="TotalQuantity"
              value={formData.TotalQuantity}
              onChange={(e) => setFormData({ ...formData, TotalQuantity: e.target.value })}
              required
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
            FoodName: editItem ? editItem.FoodName : '',
            Price: editItem ? editItem.Price : undefined,
            TotalQuantity: editItem ? editItem.TotalQuantity : undefined,
          }}
        >
          <Form.Item
            label="Food Price (Naira)"
            name="Price"
            rules={[
              {
                required: true,
                message: 'Please input the price of your food',
              },
            ]}
          >
            <Input
              placeholder="input price"
              type="number"
              style={{ height: '45px', bottom: '10px' }}
            />
          </Form.Item>
          <Form.Item
            label="Food Quantity"
            name="TotalQuantity"
            rules={[
              {
                required: true,
                message: 'Please input the quantity of your food',
              },
            ]}
          >
            <Input
              placeholder="input quantity"
              style={{ height: '45px', bottom: '10px' }}
              type="number"
            />
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