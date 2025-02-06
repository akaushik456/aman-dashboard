import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Typography, Switch, ConfigProvider, theme } from "antd";
import { LockOutlined, UserOutlined, BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  // Load theme from localStorage
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Toggle theme and save to localStorage
  const toggleTheme = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  // Apply background and text color on theme change
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          transition: "all 0.3s ease",
        }}
      >
        {/* Dark Mode Toggle */}
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={darkMode}
          onChange={toggleTheme}
          style={{ marginBottom: 20 }}
        />

        {/* Login Form */}
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            borderRadius: "8px",
            background: darkMode ? "#222" : "#f5f5f5",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={2} style={{ color: darkMode ? "#fff" : "#000" }}>
            Sign In
          </Title>
          <Text style={{ color: darkMode ? "#ddd" : "#333" }}>
            Enter your username and password
          </Text>

          <Form name="login" initialValues={{ remember: true }} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your username!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Checkbox style={{ color: darkMode ? "#ddd" : "#333" }}>Remember me</Checkbox>
              <a style={{ float: "right", color: darkMode ? "#1890ff" : "#1890ff" }} href="#">
                Forgot password?
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block onClick={() => navigate("/dashboard")}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
