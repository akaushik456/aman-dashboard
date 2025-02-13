import React, { useState } from "react";
import { Layout, Menu, Button, Modal, Upload, message } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const { Header, Content, Footer, Sider } = Layout;

const Categories = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  

  const handleUpload = ({ file }) => {
    console.log(file); // Debugging file object
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result); // Debugging base64 string
      setSelectedImage(reader.result);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (crop) => {
    if (selectedImage && crop.width && crop.height && crop.x !== undefined && crop.y !== undefined) {
      const image = new Image();
      image.src = selectedImage;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
  
        // Drawing the cropped area onto the canvas
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
        const croppedDataUrl = canvas.toDataURL("image/png"); // Create a data URL for the cropped image
        setCroppedImage(croppedDataUrl); // Save the cropped image to state
      };
    }
  };
  

  const handleSaveCroppedImage = async () => {
    if (!croppedImage) {
      message.error("Please crop the image first");
      return;
    }

    // Example API request
    try {
      const response = await fetch('/api/upload-cropped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: croppedImage }),
      });
      if (response.ok) {
        message.success('Image uploaded successfully');
      } else {
        message.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Error uploading image');
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu theme="dark" defaultSelectedKeys={["2"]} mode="inline" items={[
      { key: "1", label: <Link to="/dashboard">Dashboard</Link> },
      { key: "2", label: <Link to="/categories">Categories</Link> }
       ]} />
      </Sider>
      <Layout>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Categories</h2>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Header>
        <Content style={{ margin: "16px" }}>
  <Upload showUploadList={false} beforeUpload={() => false} onChange={handleUpload}>
    <Button icon={<PlusOutlined />}>Upload Image</Button>
  </Upload>

  {/* Check if croppedImage is not null */}
  {croppedImage ? (
  <div style={{ marginTop: 20 }}>
    <h3>Cropped Image:</h3>
    <img src={croppedImage} alt="Cropped" style={{ maxWidth: "100%", display: "block", marginTop: 10 }} />
  </div>
) : (
  selectedImage && (
    <div style={{ marginTop: 20 }}>
      <h3>Original Image:</h3>
      <img src={selectedImage} alt="Original" style={{ maxWidth: "100%", display: "block", marginTop: 10 }} />
    </div>
  )
)}
</Content>
        <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()}</Footer>
      </Layout>
      <Modal title="Crop Image" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
        {selectedImage && (
          <ReactCrop
            src={selectedImage}
            crop={crop}
            onChange={setCrop}
            onComplete={handleCropComplete}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default Categories;
