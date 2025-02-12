import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Typography, Switch, ConfigProvider, message, theme } from "antd";
import { LockOutlined, UserOutlined, BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [loading, setLoading] = useState(false);

  // Toggle theme and save to localStorage
  const toggleTheme = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  // Handle Login Submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      message.error("Server not responding. Check backend.");
    }
    setLoading(false);
  };
  
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    try {
      // Send a POST request to your backend to log out
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }), // Send token for invalidation
        credentials: "include", // Ensure that cookies are sent
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success(data.message || "Logout successful");
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
      } else {
        message.error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      message.error("An error occurred while logging out.");
    }
  };

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
          <Text style={{ color: darkMode ? "#ddd" : "#333" }}>Enter your email and password</Text>

          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: 'email', message: 'Please enter a valid email address!' },
              ]}
            >
              <Input
                autoFocus
                prefix={<UserOutlined />}
                placeholder="Email"
              />
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
              <Button type="primary" htmlType="submit" block loading={loading}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Logout Button */}
        <Button type="default" onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default Login;
