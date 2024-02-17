import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Form,
  Modal,
  Select,
  Alert,
  message,
} from "antd";
import { useMenuContext } from "./MenuContext";
import {
  CreateMenu,
  UpdateMenu,
  DeleteMenu,
  GetKitchenMenus,
} from "../../../Features/Kitchen/KitchenSlice";
import moment from "moment";

const { Column } = Table;
const { Search } = Input;

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const {
    isModalVisible,
    openModal,
    closeModal,
    userData,
    auth,
    setMenus,
    menus,
  } = useMenuContext();
  const [newMenuAlertVisible, setNewMenuAlertVisible] = useState(false);
  const [editMenuAlertVisible, setEditMenuAlertVisible] = useState(false);
  const [deleteMenuAlertVisible, setDeleteMenuAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({
    KitchenId: userData.Id,
    FoodName: "",
    Category: "",
    Class: "",
    TotalQuantity: "",
    Status: "",
    Price: "",
  });
  const [loadingMenus, setLoadingMenus] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // console.log(userData)

  const fetchMenus = async () => {
    try {
      setLoadingMenus(true);
      const response = await GetKitchenMenus(userData, auth);

      if (response.code === 200) {
        const menuItemsArray = response.body || []; // Ensure menuItemsArray is not null or undefined
        const sortedMenus = menuItemsArray.sort((a, b) => {
          return moment(b.CreatedAt).valueOf() - moment(a.CreatedAt).valueOf();
        });
        setMenuItems(sortedMenus);
      } else {
        message.error("Failed to fetch menus");
      }

      setLoadingMenus(false);
    } catch (error) {
      console.error(error);
      message.error("Internal Server Error", error);
      setLoadingMenus(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchMenus, 2000);
    return () => clearInterval(intervalId);
  }, []);

  //Items to show in a table not to cause TMI
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const newValues = {
        ...formData,
        Status: formData.TotalQuantity > 0 ? "available" : "finished",
        CreatedAt: moment().toISOString(),
      };

      const response = await CreateMenu(newValues, auth, userData);
      console.log(response);
      if (response.code === 200) {
        if (editItem) {
          const updatedMenuItems = menuItems.map((item) => {
            if (item.key === editItem.key) {
              return {
                ...item,
                Price: values.Price,
                TotalQuantity: values.TotalQuantity,
                Status: values.TotalQuantity > 0 ? "available" : "finished",
              };
            }
            return item;
          });

          localStorage.setItem("menus", JSON.stringify(updatedMenuItems));

          setMenuItems(updatedMenuItems);
          setEditItem(null);
        } else {
          const newMenuItem = {
            key: response.body.Id,
            ...formData,
            Status: formData.TotalQuantity > 0 ? "available" : "finished",
          };

          const updatedMenuItems = menuItems
            ? menuItems.concat(newMenuItem)
            : [newMenuItem];

          localStorage.setItem("menus", JSON.stringify(updatedMenuItems));

          setMenuItems(updatedMenuItems);
          message.success("Menu item created successfully.");
          // console.log(response);
        }
        fetchMenus();
        closeModal();
      } else {
        setLoading(false);
        message.error("Failed to create menu");
      }
    } catch (error) {
      console.error("Internal Server Error", error);
      message.error("Internal Server Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this menu item?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        type: "danger",
      },
      onOk: async () => {
        try {
          const response = await DeleteMenu(auth, record);
          // console.log(response);
          if (
            response.message === `FoodMenu with id ${MenuId} has been deleted!`
          ) {
            const updatedMenuItems = menuItems.filter(
              (item) => item.key !== record.key
            );
            setMenuItems(updatedMenuItems);

            const updatedMenus = menus.filter((menus) => menus !== record.key);
            setMenus(updatedMenus);

            localStorage.setItem("menus", JSON.stringify(updatedMenuItems));

            message.success("Menu item deleted successfully");
            if (updatedMenuItems.length === 0) {
              setMenuItems([]);
            }
            clearLocalStorage();
          }
          fetchMenus();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  // console.log('Okay' , menus)
  const menusData = menus || [];

  const MenuId = menusData.Id;

  // console.log('This is me ', MenuId);
  // console.log(menusData)

  const handleEditFormSubmit = async (values) => {
    setLoading(true);
    try {
      const menuId = editItem ? editItem.key : null;

      if (!menuId) {
        console.error("MenuId is undefined or null.");
        return;
      }

      const payload = {
        TotalQuantity: values.TotalQuantity,
        Price: values.Price,
        Status: values.TotalQuantity > 0 ? "available" : "finished",
      };

      const response = await UpdateMenu(menuId, payload, auth);

      if (response) {
        if (response.code === 200) {
          const updatedMenuItems = menuItems.map((item) => {
            if (item.key === menuId) {
              return {
                ...item,
                Price: values.Price,
                TotalQuantity: values.TotalQuantity,
                Status: values.TotalQuantity > 0 ? "available" : "finished",
              };
            }
            return item;
          });

          localStorage.setItem("menus", JSON.stringify(updatedMenuItems));

          setMenuItems(updatedMenuItems);
          message.success("Menu item updated successfully");

          setMenus(response.body);
          fetchMenus();
        } else {
          console.error("Failed to update menu item");
        }
      } else {
        console.error("Response is undefined or null.");
      }
    } catch (error) {
      console.error(error);
      message.error("Internal Server Error", error);
    } finally {
      setLoading(false);
      setEditModalVisible(false);
    }
  };

  const filteredMenuItems = menuItems
    ? menuItems
        .filter(
          (item) =>
            item.FoodName &&
            item.FoodName.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((item) => ({ ...item, key: item.Id }))
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("menus");
  };

  return (
    <div style={{ marginLeft: "2%" }}>
      <div
        style={{ display: "flex", flexDirection: "row", marginLeft: "auto" }}
      >
        <h1 style={{ fontFamily: "sans-serif, OpenSans", marginTop: "1rem" }}>
          Menus
        </h1>
        <div
          style={{ display: "flex", flexDirection: "row", marginLeft: "auto" }}
        >
          <Search
            placeholder="Search for menus"
            style={{ width: "20rem", marginRight: "1rem", marginTop: "1rem" }}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            style={{ marginLeft: "auto", marginTop: "1rem" }}
            onClick={openModal}
          >
            Add a new menu
          </Button>
        </div>
      </div>
      <Table
        dataSource={filteredMenuItems}
        style={{ width: "60rem", marginLeft: "5rem" }}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: menuItems ? menuItems.length : 0,
          onChange: handlePageChange,
        }}
      >
        <Column title="Food Name" dataIndex="FoodName" key="key" />
        <Column title="Food Category" dataIndex="Category" key="key" />
        <Column title="Food Price (Naira)" dataIndex="Price" key="key" />
        <Column title="Food Quantity" dataIndex="TotalQuantity" key="key" />
        <Column title="Food Class" dataIndex="Class" key="key" />

        <Column
          title="Food Status"
          dataIndex="TotalQuantity"
          key="key"
          render={(quantity, record) => (
            <Tag color={quantity > 0 ? "green" : "red"}>
              {quantity > 0 ? "available" : "finished"}
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
            <div style={{ justifyContent: "flex-start" }}>
              <label htmlFor="foodName">Name</label>
              <input
                type="text"
                id="FoodName"
                name="FoodName"
                placeholder="Input name of the item"
                style={{ width: "70%", height: "10px", borderRadius: 5 }}
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
                message: "Please select a category",
              },
            ]}
          >
            <Select
              style={{ width: "60%" }}
              onChange={(value) =>
                setFormData({ ...formData, Category: value })
              }
            >
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Snacks">Snacks</Select.Option>
              <Select.Option value="Drinks">Drinks</Select.Option>
              <Select.Option value="Package">Package</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Class"
            name="Class"
            rules={[
              {
                required: true,
                message: "Please select a class",
              },
            ]}
          >
            <Select
              style={{ width: "60%" }}
              onChange={(value) => setFormData({ ...formData, Class: value })}
            >
              {formData.Category === "Food" && (
                <>
                  <Select.Option value="Rice">Rice</Select.Option>
                  <Select.Option value="Beans">Beans</Select.Option>
                  <Select.Option value="Yam">Yam</Select.Option>
                  <Select.Option value="Swallows">Swallows</Select.Option>
                  <Select.Option value="Spaghetti">Spaghetti</Select.Option>
                  <Select.Option value="Proteins">Proteins</Select.Option>
                  <Select.Option value="Sauce">Sauce</Select.Option>
                  <Select.Option value="Others">Others</Select.Option>
                  <Select.Option value="Stew">Stew</Select.Option>
                </>
              )}

              {formData.Category === "Snacks" && (
                <>
                  <Select.Option value="Doughnuts">Doughnuts</Select.Option>
                  <Select.Option value="Meatpie">Meatpie</Select.Option>
                  <Select.Option value="Cake">Cake</Select.Option>
                  <Select.Option value="Sausage Roll">
                    Sausage Roll
                  </Select.Option>
                  <Select.Option value="Salad">Salad</Select.Option>
                  <Select.Option value="Others">Others</Select.Option>
                </>
              )}

              {formData.Category === "Drinks" && (
                <>
                  <Select.Option value="Soft Drinks">Soft Drinks</Select.Option>
                  <Select.Option value="Energy Drinks">
                    Energy Drinks
                  </Select.Option>
                  <Select.Option value="Yoghurt">Yoghurt</Select.Option>
                  <Select.Option value="Bottle Water">
                    Bottle Water
                  </Select.Option>
                  <Select.Option value="Others">Others</Select.Option>
                </>
              )}

              {formData.Category === "Package" && (
                <>
                  <Select.Option value="Takeaway">Takeaway</Select.Option>
                </>
              )}
            </Select>
          </Form.Item>
          <Form.Item name="Price">
            <div style={{ justifyContent: "flex-start" }}>
              <label>Price of Item (Naira)</label>
              <input
                type="number"
                placeholder="Input food price"
                style={{ width: "70%", height: "10px", borderRadius: 5 }}
                name="Price"
                value={formData.Price}
                onChange={(e) =>
                  setFormData({ ...formData, Price: e.target.value })
                }
                required
              />
            </div>
          </Form.Item>
          <Form.Item name="TotalQuantity">
            <div style={{ justifyContent: "flex-start" }}>
              <label>Quantity of Item</label>
              <input
                type="number"
                placeholder="Input food quantity"
                style={{ width: "70%", height: "10px", borderRadius: 5 }}
                name="TotalQuantity"
                value={formData.TotalQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, TotalQuantity: e.target.value })
                }
                required
              />
            </div>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "20rem",
              width: "10rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
          style={{ marginTop: "20px" }}
          closable
          onClose={() => setNewMenuAlertVisible(false)}
        />
      )}
      {editMenuAlertVisible && (
        <Alert
          message="Menu Item Edited successfully"
          type="success"
          showIcon
          style={{ marginTop: "20px" }}
          closable
          onClose={() => setEditMenuAlertVisible(false)}
        />
      )}
      {deleteMenuAlertVisible && (
        <Alert
          message="Menu Item Deleted successfully"
          type="success"
          showIcon
          style={{ marginTop: "20px" }}
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
            FoodName: editItem ? editItem.FoodName : "",
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
                message: "Please input the price of your food",
              },
            ]}
          >
            <Input
              placeholder="input price"
              type="number"
              style={{ height: "45px", bottom: "10px" }}
            />
          </Form.Item>
          <Form.Item
            label="Food Quantity"
            name="TotalQuantity"
            rules={[
              {
                required: true,
                message: "Please input the quantity of your food",
              },
            ]}
          >
            <Input
              placeholder="input quantity"
              style={{ height: "45px", bottom: "10px" }}
              type="number"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "20rem",
              width: "10rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
