import React, { useState } from "react";
import { Card, Form, Button, Upload, message, Modal, Input } from "antd";
import { UploadOutlined, PlusOutlined, LockOutlined } from "@ant-design/icons";

function Settings() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);

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

  const handleAddStaff = () => {
    message.success("New Staff Added Successfully");
    setModalVisible(false);
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
              <Button key="change" type="primary" onClick={handleAddStaff}>
                Add a new Staff
              </Button>,
            ]}
            >
              <Form form={form} onFinish={onFinish}>
                <Form.Item
                  label="Firstname"
                  name="Firstname"
                >
                  <Input placeholder="Input staff firstname"/>
                </Form.Item>
                <Form.Item
                  label="Lastname"
                  name="Lastname"
                >
                  <Input placeholder="input staff Lastname"/>
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="Email"
                >
                  <Input type="email" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="Password"
                >
                  <Input.Password />
                </Form.Item>
              </Form>
            </Modal>

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
    </div>
  );
}

export default Settings;
