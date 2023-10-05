import React, { useState } from "react";
import { Card, Form, Button, Upload, message, Modal, Input } from "antd";
import { UploadOutlined, PlusOutlined, LockOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

function Settings() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [staffManagement, setStaffManagement] = useState([]); // State to store staff members
  const [deleteStaffIndex, setDeleteStaffIndex] = useState(null); // State to track the staff to delete
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false); // State to control the delete confirmation modal
  const [staffShowPasswords, setStaffShowPasswords] = useState([]);
  
  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  const handleFileUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handlePasswordChange = () => {
    message.success("Password changed successfully");
    setModalVisible(false);
  };

  const handleAddStaff = (values) => {
    const { Firstname, Lastname, Password } = values;
    const username = `${Firstname} ${Lastname}`; // Create the username
  
    // Create a staff member object
    const staffMember = {
      username,
      password: Password,
    };
  
    // Add the staff member to the staff management array
    setStaffManagement([...staffManagement, staffMember]);
  
    // Add an initial showPassword state for the new staff member
    setStaffShowPasswords([...staffShowPasswords, false]);
  
    message.success("New Staff Added Successfully");
    setAddStaffModalVisible(false);
  };
  

  const togglePasswordVisibility = (index) => {
    const updatedShowPasswords = [...staffShowPasswords];
    updatedShowPasswords[index] = !updatedShowPasswords[index];
    setStaffShowPasswords(updatedShowPasswords);
  };

  const handleDeleteStaff = () => {
    if (deleteStaffIndex !== null) {
      // Create a copy of the staff management array
      const updatedStaffManagement = [...staffManagement];
      
      // Find the index of the staff member to delete
      updatedStaffManagement.splice(deleteStaffIndex, 1);
      setStaffManagement(updatedStaffManagement);

      // Close the delete confirmation modal
      setDeleteConfirmationVisible(false);
      setDeleteStaffIndex(null);
    }
  };

  return (
    <div style={{ marginTop: "2rem", marginLeft: "7rem" }}>
      <Card title="Settings" style={{ width: "60rem" }}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
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
                  onClick={() => form.validateFields().then(handleAddStaff)}
                >
                  Add a new Staff
                </Button>,
              ]}
            >
              <Form form={form}>
                <Form.Item
                  label="Firstname"
                  name="Firstname"
                  rules={[
                    {
                      required: true,
                      message: "Please enter staff firstname",
                    },
                  ]}
                >
                  <Input placeholder="Input staff firstname" />
                </Form.Item>
                <Form.Item
                  label="Lastname"
                  name="Lastname"
                  rules={[
                    {
                      required: true,
                      message: "Please enter staff lastname",
                    },
                  ]}
                >
                  <Input placeholder="Input staff lastname" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="Email"
                  rules={[
                    {
                      type: "email",
                      message: "Invalid email address",
                    },
                    {
                      required: true,
                      message: "Please enter email",
                    },
                  ]}
                >
                  <Input placeholder="Input email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter password",
                    },
                  ]}
                >
                  <Input.Password style={{ height: '40px', width: '80%' }} />
                </Form.Item>
              </Form>
            </Modal>

            <Form.Item label="Change Password">
              <Button
                type="primary"
                shape="round"
                icon={<LockOutlined />}
                style={{ marginLeft: "30rem", height: '10%' }}
                onClick={() => setModalVisible(true)}
              >
                Change your Password
              </Button>
            </Form.Item>

            <Form.Item label="Upload/Update Kitchen Image">
              <Upload
                name="kitchenImage"
                onChange={handleFileUpload}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ width: "12rem", marginLeft: "30rem" }}
                >
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Modal
        title="Change Password"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="change" type="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="OTP"
            name="OTP"
            rules={[
              {
                required: true,
                message: "Please enter the OTP",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="NewPassword"
            rules={[
              {
                required: true,
                message: "Please enter your new password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
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
              {staff.username} - {staffShowPasswords[index] ? staff.password : "******"}{" "}
              <Button
                icon={<EyeOutlined />}
                onClick={() => togglePasswordVisibility(index)}
                style={{ marginLeft: "1rem", marginTop: '2%' }}
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
      </div>
    </div>
  );
}

export default Settings;
