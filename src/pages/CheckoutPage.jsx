import { Button, Card, DatePicker, Form, Grid, Input, Table, TimePicker, Typography, message } from "antd";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from '../slices/Cartslice';
import LocationPicker from '../components/LocationPicker';
import '../css/CheckoutPage.css'

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const [form] = Form.useForm();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const locationPickerRef = useRef(null);
  const screens = useBreakpoint();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationPickerRef.current && !locationPickerRef.current.contains(event.target)) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const columns = [
    {
      title: 'Products',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={record.image || 'https://via.placeholder.com/50'}
            alt={record.name}
            style={{
              width: 50,
              height: 50,
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
      render: (price) => `${price.toLocaleString()} $`
    },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `${(record.quantity * record.price).toLocaleString()}$`
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onFinish = (values) => {
    if (!selectedLocation) {
      message.error('Please select your location');
      return;
    }

    console.log('Order details:', {
      ...values,
      location: selectedLocation,
      items: cartItems,
      total
    });

    setOrderPlaced(true);
    message.success('Order placed successfully!');
    dispatch(clearCart());
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    form.setFieldsValue({ address: location.address });
    setIsSuggestionsVisible(false); // Close suggestions after selection
  };

  const handleSuggestionsToggle = (visible) => {
    setIsSuggestionsVisible(visible);
  };

  if (orderPlaced) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Title level={2}>Your Order has been successfully placed</Title>
        <Text>Your order will be delivered to your address at the selected date</Text>
        <br />
        <Button
          type="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 20 }}
        >
          Return to Home Page
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Title level={2}>Your cart is empty</Title>
        <Button
          type="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 20 }}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }
  function scrolToTop() {
    window.scroll({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '20px 16px', // Adjusted padding for mobile
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 24,
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    }}>
      {/* Left Column - Delivery Information */}
      <Card title="Delivery Information" style={{ borderRadius: 8 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Delivery Location" style={{ marginBottom: 0 }}>
            <div
              ref={locationPickerRef}
              style={{
                height: 300,
                width: '100%',
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #d9d9d9',
                marginBottom: 16
              }}
            >
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                onSuggestionsToggle={handleSuggestionsToggle}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Click on the map to select your delivery location
            </Text>
          </Form.Item>

          <Form.Item
            name="address"
            label="Full Address"
            rules={[{ required: true, message: 'Please enter your full address' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="deliveryDate"
              label="Delivery Date"
              rules={[{ required: true, message: 'Please select delivery date' }]}
            >
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>

            <Form.Item
              name="deliveryTime"
              label="Delivery Time"
              rules={[{ required: true, message: 'Please select delivery time' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} size="large" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      {/* Right Column - Order Summary */}
      <Card title="Order Summary" className="order-summary-card">
        <Table
          columns={columns}
          dataSource={cartItems.map(item => ({
            ...item,
            key: item.id
          }))}
          pagination={false}
          rowKey="id"
          scroll={screens.xs ? { x: true } : {}}
          size={screens.xs ? 'small' : 'middle'}
          className="order-table"
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={screens.xs ? 1 : 3}>
                <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>{total.toLocaleString()}$</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
        
          <Button
            type="primary"
            size="large"
            block
            onClick={() => form.submit() & scrolToTop()}
            className="place-order-btn"
          >
            Place Order
          </Button>
        
      </Card>
    </div>
  );
};

export default CheckoutPage;