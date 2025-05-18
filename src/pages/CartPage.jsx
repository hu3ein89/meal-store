import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, InputNumber, Popconfirm, Empty, message, Grid } from "antd";
import { Typography } from "antd";
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import { removeFromCart, updateQuantity } from "../slices/Cartslice";
import { Link, useNavigate } from 'react-router-dom'
import { setActiveMenu } from "../slices/UiSlice";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CartPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const screens = useBreakpoint();
    const cartItems = useSelector((state) => state.cart.items)

    const handleQuantityChange = (id, quantity) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }))
        } else {
            message.warning('The number of products cant be less than one')
        }
    }

    const handleRemove = (id) => {
        dispatch(removeFromCart({ id }))
        message.success('Product removed')
    }

    // Responsive columns configuration
    const getColumns = () => {
        const baseColumns = [
            { 
                title: 'Product', 
                dataIndex: 'name', 
                key: 'name',
                render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img 
                            src={record.image || 'https://via.placeholder.com/50'} 
                            alt={record.name}
                            style={{ 
                                width: screens.xs ? 40 : 50, 
                                height: screens.xs ? 40 : 50, 
                                objectFit: 'cover',
                                borderRadius: 4
                            }}
                        />
                        <Text>{text}</Text>
                    </div>
                )
            },
            {
                title: 'Price', 
                dataIndex: 'price', 
                key: 'price',
                render: (price) => `${price.toLocaleString()} $`,
                responsive: ['md']
            }
        ];

        const mobileColumns = [
            {
                title: 'Qty/Total', 
                key: 'mobile',
                render: (_, record) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div>
                            <Text strong>Qty: </Text>
                            <InputNumber
                                min={1}
                                value={record.quantity}
                                onChange={(value) => handleQuantityChange(record.id, value)}
                                size={screens.xs ? 'small' : 'middle'}
                            />
                        </div>
                        <div>
                            <Text strong>Total: </Text>
                            <Text>{(record.quantity * record.price).toLocaleString()}$</Text>
                        </div>
                    </div>
                )
            }
        ];

        const desktopColumns = [
            {
                title: 'Quantity', 
                dataIndex: 'quantity', 
                key: 'quantity',
                render: (_, record) => (
                    <InputNumber
                        min={1}
                        value={record.quantity}
                        onChange={(value) => handleQuantityChange(record.id, value)}
                    /> 
                )
            },
            {
                title: 'Total', 
                dataIndex: 'total',
                render: (_, record) => `${(record.quantity * record.price).toLocaleString()}$`
            }
        ];

        const actionColumn = {
            title: 'Action', 
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title='Are you sure you want to delete this item'
                    onConfirm={() => handleRemove(record.id)}
                    okText='YES'
                    cancelText='NO'
                >
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                        size={screens.xs ? 'small' : 'middle'}
                    >
                        {screens.xs ? '' : 'Remove'}
                    </Button>
                </Popconfirm>
            )
        };

        return screens.xs 
            ? [...baseColumns, ...mobileColumns, actionColumn]
            : [...baseColumns, ...desktopColumns, actionColumn];
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning('Your cart is empty')
        } else {
            navigate('/checkout')
        }
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '60vh',
                flexDirection: 'column',
                padding: 20
            }}>
                <Empty
                    description={
                        <Text style={{ fontSize: screens.xs ? 16 : 18 }}>
                            Your cart is empty
                        </Text>
                    }
                />
                <Link to='/product' onClick={() => dispatch(setActiveMenu('product'))}>
                    <Button 
                        type="primary" 
                        icon={<ShoppingOutlined />}
                        size={screens.xs ? 'middle' : 'large'}
                        style={{ marginTop: 16,borderRadius:'0px' }}
                    >
                        SHOP NOW
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: screens.xs ? '12px' : '20px' }}>
            <Title level={screens.xs ? 3 : 2} style={{ marginBottom: 16 }}>
                Shopping Cart
            </Title>
            
            <Table
                columns={getColumns()}
                dataSource={cartItems}
                rowKey='id'
                pagination={false}
                scroll={screens.xs ? { x: true } : {}}
                size={screens.xs ? 'small' : 'middle'}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={screens.xs ? 1 : 3}>
                            <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>Total</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                            <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>
                                {total.toLocaleString()}$
                            </Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
            
            <div style={{ 
                marginTop: 16,
                display: 'flex',
                flexDirection: screens.xs ? 'column' : 'row',
                gap: screens.xs ? 12 : 8
            }}>
                <Button 
                style={{borderRadius:'0px'}}
                    type="primary" 
                    size={screens.xs ? 'middle' : 'large'} 
                    onClick={handleCheckout}
                    block={screens.xs}
                >
                    Checkout
                </Button>
                <Link to='/product' onClick={() => dispatch(setActiveMenu('product'))}>
                    <Button 
                    style={{borderRadius:'0px'}}
                        icon={<ShoppingOutlined />} 
                        size={screens.xs ? 'middle' : 'large'}
                        block={screens.xs}
                    >
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default CartPage;