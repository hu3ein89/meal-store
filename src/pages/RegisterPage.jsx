import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message, Card, Typography, Divider, Space, Row, Col } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { registration } from "../slices/AuthorizeSlice";
import { setActiveMenu } from "../slices/UiSlice";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      await dispatch(registration({
        username: values.username,
        password: values.password,
        email: values.email
      })).unwrap();
      
      message.success('Registration successful! Welcome aboard!');
      navigate('/');
    } catch (err) {
      message.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      borderRadius:'10px',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(360deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.8) 100%)',
      padding: '20px',
    }}>
      <Card
        hoverable
        style={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>Create Your Account</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>Join our community today</Text>
        </div>

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Confirm Password" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          {error && (
            <div style={{ 
              color: '#ff4d4f', 
              marginBottom: 16,
              padding: '10px',
              background: '#fff2f0',
              borderRadius: 6,
              border: '1px solid #ffccc7',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
              style={{ 
                height: 45,
                fontWeight: 600,
                marginTop: 10,
                background: 'linear-gradient(90deg, #1890ff 0%, #096dd9 100%)',
                border: 'none'
              }}
            >
              Register Now
            </Button>
          </Form.Item>

          <Divider style={{ color: '#8c8c8c' }}>or</Divider>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text>Already have an account?</Text>
                
                <Link to='/login'
                onClick={()=> dispatch(setActiveMenu('login'))}
                >
                  <Button style={{ padding: 0, fontWeight: 500 }} type="link">Sign in</Button>
                </Link>
                
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;