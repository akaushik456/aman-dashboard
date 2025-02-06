import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, theme, Button, Flex } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./categories.css";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />),
  getItem(<Link to="/categories">Categories</Link>, "2", <DesktopOutlined />),
  getItem("Listing", "sub1", <UserOutlined />, [
    getItem("List 1", "3"),
    getItem("List 2", "4"),
    getItem("List 3", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "10", <FileOutlined />),
];

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Logout action
    navigate("/"); // Redirect to login page
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { title: "User" },
    { title: "Categories" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["2"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, 
          display:"Flex",
          justifyContent:"space-between",
          alignItems:"center"
         }}>
          <h2 style={{ margin: "16px", fontSize:"18px" }}>Categories</h2>
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
           <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />
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
    </Layout>
  );
};

export default Categories;
