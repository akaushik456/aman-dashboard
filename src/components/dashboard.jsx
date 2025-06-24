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
  getItem(<Link to="/data">Data</Link>, "11"),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Logout handler function

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/check-session", {
          method: "GET",
           headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        
        if (!response.ok) {
         
          navigate("/dashboard"); 
        }
      } catch (error) {
        navigate("/login"); // ✅ Redirect to login if error occurs
      }
    };
  
    checkSession();
  }, []);


  const handleLogout = async () => {
    try {
      // Make sure cookies are included in the request
      const response = await fetch("https://backend-login-api-d0py.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ Include cookies (important!)
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message || "Logout successful");
        localStorage.removeItem("token"); // ✅ Remove token from storage
        navigate("/"); // ✅ Redirect to login page
      } else {
        message.error(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      message.error("An error occurred while logging out.");
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        message.error("Failed to load products. Please try again later.");
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
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/product/${record.id}`)} // Navigate to product details
          >
            View
          </Button>

          {/* Delete Button with Confirmation */}
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
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
            onClick={handleLogout} // Call handleLogout when clicked
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
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
