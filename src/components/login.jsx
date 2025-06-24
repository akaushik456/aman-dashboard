import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Typography, Switch, ConfigProvider, message, theme } from "antd";
import { LockOutlined, UserOutlined, BulbOutlined, MoonOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuthPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1a1a1a" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  const toggleTheme = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  const handleLogin = async (values) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        message.error(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      message.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Password reset link sent!");
        setIsForgotPassword(false);
      } else {
        message.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Server not responding.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Logout successful");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        message.error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      message.error("An error occurred while logging out.");
    }
  };

  const handleRegister = async (values) => {
    if (loading) return;
    setLoading(true);
  
    try {
      console.log("📤 Sending Register Data:", values); // Debugging
  
      const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success("Registration successful!");
        setIsSignUp(false); // Switch to login after sign-up
      } else {
        message.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      message.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", transition: "all 0.3s ease" }}>
        <Switch checkedChildren={<MoonOutlined />} unCheckedChildren={<BulbOutlined />} checked={darkMode} onChange={toggleTheme} style={{ marginBottom: 20 }} />

        <div style={{ maxWidth: "400px", width: "100%", padding: "20px", borderRadius: "8px", background: darkMode ? "#222" : "#f5f5f5", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Title level={2} style={{ color: darkMode ? "#fff" : "#000" }}>
            {isSignUp ? "Sign Up" : isForgotPassword ? "Forgot Password" : "Sign In"}
          </Title>
          <Text style={{ color: darkMode ? "#ddd" : "#333" }}>
            {isForgotPassword
              ? "Enter your email to receive a password reset link"
              : isSignUp
              ? "Create a new account"
              : "Enter your email and password"}
          </Text>

          {isForgotPassword ? (
            <Form name="auth-form" layout="vertical" onFinish={isSignUp ? handleRegister : handleLogin}>
              <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }, { type: 'email', message: 'Enter a valid email!' }]}>
                <Input autoFocus prefix={<UserOutlined />} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form name="auth-form" layout="vertical" onFinish={handleLogin}>
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
          )}

          {!isForgotPassword && (
            <Text style={{ color: darkMode ? "#ddd" : "#333" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <a style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </a>
              <br />
              <a style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => setIsForgotPassword(true)}>
                Forgot Password?
              </a>
            </Text>
          )}
        </div>

        <Button type="default" onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default AuthPage;
