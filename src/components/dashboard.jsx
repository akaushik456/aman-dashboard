import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Space, Table, Tag, Breadcrumb, Layout, Menu, theme, Button, message, Popconfirm } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />),
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

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

  }, []);

  const breadcrumbItems = [{ title: "User" }, { title: "Dashboard" }];

  // Delete Product Function
  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success("Product deleted successfully!");
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) => <img src={src} alt="Product" style={{ width: 50 }} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* View Button */}
          <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/product/${record.id}`)}>
            View
          </Button>

          {/* Delete Button with Confirmation */}
          <Popconfirm title="Are you sure to delete this product?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "16px",
          }}
        >
          <span style={{ marginLeft: "16px", fontSize: "18px", fontWeight: "bold" }}>Dashboard</span>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: "16px" }}
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
            <h2>Products List</h2>
            <Table columns={columns} dataSource={products} loading={loading} rowKey="id" />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
