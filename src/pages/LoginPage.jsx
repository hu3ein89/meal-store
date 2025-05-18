import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message, Card, Typography, Divider, Space } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from "../slices/AuthorizeSlice";
import { setActiveMenu } from "../slices/UiSlice";

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const onFinish = async (values) => {
        try {
            await dispatch(login(values)).unwrap();
            message.success('You have successfully logged in');
            navigate('/');
        } catch (err) {
            message.error(err);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius:'2%',
            minHeight: '100vh',
            background: 'linear-gradient(360deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}>
            <Card
                style={{
                    width: 400,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderRadius: 8
                }}
                bodyStyle={{ padding: 32 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>Welcome Back</Title>
                    <Text type="secondary">Sign in to your account</Text>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    {error && (
                        <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
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
                            style={{ marginTop: 8 }}
                        >
                            Log In
                        </Button>
                    </Form.Item>

                    <Divider>or</Divider>

                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Text>Don't have an account?</Text>
                        <Link to='/register' onClick={()=>dispatch(setActiveMenu('register'))}>
                        <Button type="link" style={{ padding: 0 }}>
                            Sign up
                        </Button>
                        </Link>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;