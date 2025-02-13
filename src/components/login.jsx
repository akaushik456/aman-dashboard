import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Typography, Switch, ConfigProvider, message, theme } from "antd";
import { LockOutlined, UserOutlined, BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuthPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign up

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  const toggleTheme = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint = isSignUp ? "register" : "login"; // Change API based on mode
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include", // Required for session cookies
      });

      const data = await response.json();
      if (response.ok) {
        message.success(`${isSignUp ? "Registration" : "Login"} successful!`);
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        message.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Server not responding. Check backend.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Logout successful");
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login page
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
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", transition: "all 0.3s ease" }}>
        {/* Dark Mode Toggle */}
        <Switch checkedChildren={<MoonOutlined />} unCheckedChildren={<BulbOutlined />} checked={darkMode} onChange={toggleTheme} style={{ marginBottom: 20 }} />

        {/* Auth Form */}
        <div style={{ maxWidth: "400px", width: "100%", padding: "20px", borderRadius: "8px", background: darkMode ? "#222" : "#f5f5f5", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Title level={2} style={{ color: darkMode ? "#fff" : "#000" }}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Title>
          <Text style={{ color: darkMode ? "#ddd" : "#333" }}>{isSignUp ? "Create a new account" : "Enter your email and password"}</Text>

          <Form name="auth-form" layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }, { type: 'email', message: 'Enter a valid email!' }]}>
              <Input autoFocus prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Checkbox style={{ color: darkMode ? "#ddd" : "#333" }}>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {isSignUp ? "Sign Up" : "Log In"}
              </Button>
            </Form.Item>
          </Form>

          {/* Switch Between Login and Sign Up */}
          <Text style={{ color: darkMode ? "#ddd" : "#333" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <a style={{ color: darkMode ? "#1890ff" : "#1890ff", cursor: "pointer" }} onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </a>
          </Text>
        </div>

        {/* Logout Button */}
        <Button type="default" onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default AuthPage;
