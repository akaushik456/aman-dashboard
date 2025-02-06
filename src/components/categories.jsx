import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, theme, Button, Modal } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./categories.css";

const { Header, Content, Footer, Sider } = Layout;

// Function to create menu items
function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick, // Fix case-sensitive issue
  };
}

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Open Popup
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close Popup
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  // Sidebar Menu Items
  const items = [
    getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />),
    getItem(<Link to="/categories">Categories</Link>, "2", <DesktopOutlined />),
    getItem("Listing", "sub1", <UserOutlined />, [
      getItem("List 1", "3"),
      getItem("Jawahar", "4", "sub3"),
      getItem("Bellator Group", "9", <BellOutlined />, null, showModal), // Attach popup function
      getItem("List 3", "5"),
    ]),
    getItem("Team", "sub2", <TeamOutlined />, [
      getItem("Team 1", "6"),
      getItem("Team 2", "8"),
    ]),
    getItem("Files", "10", <FileOutlined />),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["2"]} mode="inline" items={items} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "16px", fontSize: "18px" }}>Categories</h2>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: "26px" }}
          >
            Logout
          </Button>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "User" }, { title: "Categories" }]} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <h3>Aman</h3>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>

      {/* ✅ Popup Modal for Bellator Group */}
      <Modal title="Bellator Group" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Welcome to Bellator Group!</p>
        <p>Here is some information about our group.</p>
      </Modal>
    </Layout>
  );
};

export default Categories;
