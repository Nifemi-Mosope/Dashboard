import React, { useState } from "react";
import { Card, Form, Button, Upload, message, Modal, Input } from "antd";
import { UploadOutlined, PlusOutlined, LockOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMenuContext } from "./MenuContext";
import { AddStaff, UploadImage, DeleteStaff } from "../Features/KitchenSlice";

function Settings() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [staffManagement, setStaffManagement] = useState([]);
  const [deleteStaffIndex, setDeleteStaffIndex] = useState(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [staffShowPasswords, setStaffShowPasswords] = useState([]);
  const { userData, auth, setStaffs, setImage, staffs } = useMenuContext();
  const [formData, setFormData] = useState({
    FirstName: '',
    KitchenId: userData.Id,
    LastName: '',
    Email: '',
    Password: '',
    Phone: '',
    University: userData.University,
    Role: '',
  });
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [uploadImageModalVisible, setUploadImageModalVisible] = useState(false);

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  const isFormValid = () => {
    return (
      formData.FirstName !== '' &&
      formData.LastName !== '' &&
      formData.Email !== '' &&
      formData.Phone !== '' &&
      formData.University !== '' &&
      formData.Password !== ''
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setIsFormFilled(isFormValid());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);
        formData.append("KitchenId", userData.Id);
  
        const response = await UploadImage(formData);
  
        if (response.code === 200) {
          localStorage.setItem('Image', JSON.stringify(response.extrainfo));
          message.success("Image uploaded successfully");
          setUploadImageModalVisible(false);
          // console.log(response.extrainfo)
          setImage(response.extrainfo)
        }
      } else {
        message.error("Please select an image to upload.");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred during image upload.");
    }
  }
  

  const handlePasswordChange = () => {
    message.success("Password changed successfully");
    setModalVisible(false);
  };

  const handleAddStaff = async () => {
    setIsAddingStaff(true);
  
    try {
      const staffData = {
        ...formData,
        Role: 'basic',
        KitchenId: userData.Id,
      };
  
      const response = await AddStaff(staffData, auth);
      console.log(response)
      if (response.code === 200) {
        localStorage.setItem('staffs', JSON.stringify(response.body));
        const { FirstName, LastName, Email, Password } = formData;
        const username = `${FirstName} ${LastName}`;
  
        const staffMember = {
          username,
          email: Email,
          password: Password,
        };
        setStaffs(response.body)
        setStaffManagement([...staffManagement, staffMember]);
        message.success("New Staff Added Successfully");
      } else if(response.message === "Staff already exist"){
        message.error("Staff already exist");
      }
    } catch (error) {
      message.error("An error occurred while adding staff. Please try again later.");
    }
  
    setIsAddingStaff(false);
    setAddStaffModalVisible(false);
  };  

  const togglePasswordVisibility = (index) => {
    const updatedShowPasswords = [...staffShowPasswords];
    updatedShowPasswords[index] = !updatedShowPasswords[index];
    setStaffShowPasswords(updatedShowPasswords);
  };

  const handleDeleteStaff = async () => {
    const payload = {
      Id: staffs.Id
    }
    const response = await DeleteStaff(payload, auth);
    if (deleteStaffIndex !== null) {
      const updatedStaffManagement = [...staffManagement];
      
      updatedStaffManagement.splice(deleteStaffIndex, 1);
      setStaffManagement(updatedStaffManagement);

      setDeleteConfirmationVisible(false);
      setDeleteStaffIndex(null);
    }
  };

  return (
    <div style={{ marginTop: "2rem", marginLeft: "7rem" }}>
      <Card title="Settings" style={{ width: "60rem" }}>
        <Form
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          encType="multipart/form-data"
          id="uploadImage"
        >
          <div style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <Form.Item label="Add New Staff">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                style={{ marginLeft: "35rem" }}
                onClick={() => setAddStaffModalVisible(true)}
              >
                Add Staff
              </Button>
            </Form.Item>

            <Modal
              open={addStaffModalVisible}
              onCancel={() => setAddStaffModalVisible(false)}
              title="Add New Staff"
              footer={[
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="change"
                  type="primary"
                  onClick={handleAddStaff}
                  disabled={!isFormFilled}
                >
                  {isAddingStaff ? "Adding Staff..." : "Add Staff"}
                </Button>,
              ]}
            >
              <div style={{ justifyContent: 'flex-start'}}>
                <div style={{justifyContent: 'flex-start'}}>
                  <label>Firstname</label>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    placeholder="Input staff email" 
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    style={{width: '70%', height: '10px', borderRadius: 5}}
                    required
                  />
                </div>
                <div style={{justifyContent: 'flex-start'}}>
                  <label>Lastname</label>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    placeholder="Input staff Lastname"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    style={{width: '70%', height: '10px', borderRadius: 5}}
                    required
                  />
                </div>
                <div style={{justifyContent: 'flex-start'}}>
                  <label>Email</label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    placeholder="Input staff email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    style={{width: '70%', height: '10px', borderRadius: 5}}
                    required
                  />
                </div>
                <div style={{ justifyContent: 'flex-start'}}>
                  <label>Phone Number</label>
                  <input
                    type="number"
                    id="Phone"
                    name="Phone"
                    placeholder="Input mobile number" 
                    value={formData.Phone}
                    onChange={handleInputChange}
                    style={{width: '70%', height: '10px', borderRadius: 5}}
                    required
                  />
                </div>
                <div style={{ justifyContent: 'flex-start'}}>
                  <label>Password</label>
                  <input
                    type="password"
                    id="Password"
                    name="Password"
                    placeholder="Input staff password" 
                    value={formData.Password}
                    onChange={handleInputChange}
                    style={{width: '70%', height: '10px', borderRadius: 5}}
                    required
                  />
                </div>
              </div>
            </Modal>

            <Form.Item label="Upload/Update Kitchen Image">
                <Button
                  icon={<UploadOutlined />}
                  style={{ width: "12rem", marginLeft: "30rem" }}
                  onClick={() => setUploadImageModalVisible(true)}
                >
                  Upload Image
                </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Modal
        title="Upload Kitchen Image"
        open={uploadImageModalVisible}
        onOk={() => {
          setUploadImageModalVisible(false);
        }}
        onCancel={() => setUploadImageModalVisible(false)}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <input type="file" style={{display: 'flex', marginLeft: '35%'}}/>
          <Button
            type="primary"
            style={{ marginLeft: "1rem" }}
            onClick={handleUpload}
          >
            Upload Image
          </Button>
        </div>
      </Modal>

      {/* Staff Managment Side */}
      <Modal
        title="Confirm Deletion"
        open={deleteConfirmationVisible}
        onOk={handleDeleteStaff}
        onCancel={() => setDeleteConfirmationVisible(false)}
      >
        Do you want to delete the staff with username:{" "}
        {deleteStaffIndex !== null ? staffManagement[deleteStaffIndex].username : ""}?
      </Modal>

      <div style={{ marginTop: "2rem" }}>
        <Card title="Staff Management" style={{ width: "60rem" }}>
          <ul>
          {staffManagement.map((staff, index) => (
            <li key={index}>
            {staff.username} -{" "}
            {staffShowPasswords[index]
              ? staff.password
              : "******"}{" "}
            <Button
              icon={<EyeOutlined />}
              onClick={() => togglePasswordVisibility(index)}
              style={{ marginLeft: "1rem", marginTop: "2%" }}
            >
              {staffShowPasswords[index] ? "Hide" : "Show"} Password
            </Button>{" "}
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                setDeleteStaffIndex(index);
                setDeleteConfirmationVisible(true);
              }}
              style={{ marginLeft: "1rem" }}
            >
              Delete Staff
            </Button>
          </li>
          ))}

          </ul>
        </Card>
        {/* <div style={{ marginTop: "2rem" }}>
          <Card title="Danger Zone" style={{ width: "60rem", backgroundColor: '#ff0000' }}>
            <Button
              type="danger"
              danger
              onClick={handleDeleteKitchenProfile}
            >
              Delete Kitchen Profile
            </Button>
          </Card>
        </div> */}
      </div>
    </div>
  );
}

export default Settings;
