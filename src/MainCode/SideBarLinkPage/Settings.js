import React, { useState } from "react";
import { Card, Form, Button, Switch, Upload, message, Modal, Input } from "antd";
import { UploadOutlined, PlusOutlined, LockOutlined } from "@ant-design/icons";

function Settings() {
  const [form] = Form.useForm();
  const [darkMode, setDarkMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
    // Implement the logic to send a request to the endpoint with the provided parameters
    // You can use fetch or an HTTP library like Axios for this
    // Example using fetch:
    const endpoint = "/your-password-change-endpoint";
    const requestData = {
      Email: form.getFieldValue("Email"),
      OTP: form.getFieldValue("OTP"),
      NewPassword: form.getFieldValue("NewPassword"),
    };

    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          message.success("Password changed successfully");
          setModalVisible(false);
        } else {
          message.error("Password change failed. Please check your inputs.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("An error occurred while changing the password.");
      });
  };

  return (
    <div style={{ marginTop: "2rem", marginLeft: "7rem" }}>
      <Card title="Settings" style={{ width: "60rem" }}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ darkMode }}
        >
          <div style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <Form.Item label="Add New Staff">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                style={{ marginLeft: "35rem" }}
              >
                Add Staff
              </Button>
            </Form.Item>

            <Form.Item label="Update Signup Parameters">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                style={{ marginLeft: "33rem" }}
              >
                Update Entities
              </Button>
            </Form.Item>

            <Form.Item label="Change Password">
              <Button
                type="primary"
                shape="round"
                icon={<LockOutlined />}
                style={{ marginLeft: "30rem" }}
                onClick={() => setModalVisible(true)} // Open the modal on button click
              >
                Change your Password
              </Button>
            </Form.Item>

            <Form.Item label="Upload/Update Kitchen Image">
              <Upload
                name="kitchenImage"
                action="/your-upload-api-endpoint"
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

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        visible={modalVisible}
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
    </div>
  );
}

export default Settings;
