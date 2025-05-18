import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { Divider, Row, Col, Typography, Input, Button, Space } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#001529',
      color: 'white',
      padding: '40px 0 20px',
      marginTop: '50px'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Top Section */}
        <Row gutter={[40, 40]}>
          {/* About Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              <span style={{ color: '#1890ff' }}>SEAWEED</span>
            </Title>
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Bringing you the freshest seaweed-based meals straight from the ocean to your table.
                Our products are sustainably harvested and packed with nutrients.
              </Text>
            </div>
            <Space size="middle" style={{ marginTop: '20px' }}>
              <a href="#"><FacebookOutlined style={{ fontSize: '20px', color: '#1890ff' }} /></a>
              <a href="#"><InstagramOutlined style={{ fontSize: '20px', color: '#1890ff' }} /></a>
              <a href="#"><TwitterOutlined style={{ fontSize: '20px', color: '#1890ff' }} /></a>
              <a href="#"><YoutubeOutlined style={{ fontSize: '20px', color: '#1890ff' }} /></a>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>Quick Links</Title>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Home</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="/product" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Products</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="https://www.google.com/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Google</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="https://www.yahoo.com/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Yahoo</Link></li>
              <li style={{ marginBottom: '10px' }}><Link to="https://www.msn.com/" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>MSN</Link></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>Contact Us</Title>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p style={{ marginBottom: '15px' }}>
                <PhoneOutlined style={{ marginRight: '10px' }} /> +1 (555) 123-4567
              </p>
              <p style={{ marginBottom: '15px' }}>
                <MailOutlined style={{ marginRight: '10px' }} /> info@seaweed-store.com
              </p>
              <p style={{ marginBottom: '15px' }}>
                <EnvironmentOutlined style={{ marginRight: '10px' }} /> 123 Ocean Drive, Coastal City, CC 12345
              </p>
              <p>
                <ClockCircleOutlined style={{ marginRight: '10px' }} /> Mon-Fri: 9AM - 6PM
              </p>
            </div>
          </Col>

          {/* Newsletter */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>Newsletter</Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '15px', display: 'block' }}>
              Subscribe to our newsletter for the latest updates and offers.
            </Text>
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="Your email address" />
              <Button type="primary" style={{borderRadius: '0 5px 5px 0', borderLeft: 'none'}}>Subscribe</Button>
            </Space.Compact>
          </Col>
        </Row>

        <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '30px 0' }} />

        {/* Bottom Section */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © {new Date().getFullYear()} SEAWEED. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Terms of Service</Link>
              <Link to="/faq" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>FAQ</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;