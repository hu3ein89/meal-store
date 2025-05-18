import React from "react";
import { Card, List, Typography, Row, Col, Statistic, Space, Avatar, Tag } from "antd";
import { useSelector } from "react-redux";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  StarOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate dashboard statistics
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSpent = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const uniqueProducts = cartItems.length;
  const averageRating = cartItems.length > 0 
    ? (cartItems.reduce((sum, item) => sum + (item.rating || 3.5), 0)) / cartItems.length
    : 0;

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header Section */}
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>
            Dashboard
          </Title>
          <Title level={4}>Welcome back <span style={{color:'purple', fontFamily:'sans-serif'}}>{user?.username.toUpperCase() || "User"}</span>! Here's your purchase summary</Title>
        </div>

        {/* Stats Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Items"
                value={totalItems}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Spent"
                value={totalSpent.toLocaleString()}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Products"
                value={uniqueProducts}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Average Rating"
                value={averageRating.toFixed(1)}
                prefix={<StarOutlined />}
                suffix="/5"
              />
            </Card>
          </Col>
        </Row>

        {/* Purchased Products Section */}
        <Card
          title={
            <Space>
              <ShoppingCartOutlined />
              <Text strong>My Purchased Products</Text>
            </Space>
          }
          bodyStyle={{ padding: 0 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                style={{ padding: "16px 24px" }}
                actions={[
                  <Text strong>${(item.price * item.quantity).toLocaleString()}</Text>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={64}
                      src={item.image || "https://via.placeholder.com/64"}
                    />
                  }
                  title={<Text strong>{item.name}</Text>}
                  description={
                    <Space size="small">
                      <Text>${item.price.toLocaleString()}</Text>
                      <Text type="secondary">|</Text>
                      <Text>Qty: {item.quantity}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
          {cartItems.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <ShoppingCartOutlined style={{ fontSize: 48, color: "#ccc" }} />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">No purchased items yet</Text>
              </div>
            </div>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;