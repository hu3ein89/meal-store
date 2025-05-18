import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, Card, Button, Typography, Divider, Spin } from 'antd';
import { ShoppingOutlined, StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMeals } from '../slices/MealSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../css/LandingPage.css';
import { setActiveMenu } from '../slices/UiSlice';

const { Title, Text } = Typography;
const { Meta } = Card;

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items: allMeals } = useSelector(state => state.meals);

  useEffect(() => {
    const loadFeaturedMeals = async () => {
      try {
        if (!allMeals || allMeals.length === 0) {
          dispatch(fetchMeals());
        }
        
        // Get 3 random meals to feature
        const shuffled = [...(allMeals || [])].sort(() => 0.5 - Math.random());
        setFeaturedMeals(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured meals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMeals();
  }, [dispatch, allMeals]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Banner Carousel */}
      <Carousel autoplay effect="fade" className="hero-carousel">
        <div className="hero-slide slide-1">
          <div className="slide-content">
            <Title level={1} className="hero-title">Delicious Meals Delivered to Your Door</Title>
            <Text className="hero-subtitle">Order from our premium menu with just a few clicks</Text>
            <Link to='/product' onClick={()=>dispatch(setActiveMenu('product'))}>
            <Button 
              style={{borderRadius:'0px'}}
              type="primary" 
              size="large" 
              icon={<ShoppingOutlined />}
            >
              Order Now
            </Button>
            </Link>
          </div>
        </div>
        <div className="hero-slide slide-2">
          <div className="slide-content">
            <Title level={1} className="hero-title">Fresh Ingredients, Perfect Taste</Title>
            <Text className="hero-subtitle">Chef-prepared meals with love and care</Text>
            <Link to='/product' onClick={()=>dispatch(setActiveMenu('product'))}>
            <Button 
            style={{borderRadius:'0px'}}
              type="primary" 
              size="large" 
              icon={<ShoppingOutlined />}
            >
              Explore Now
            </Button>
            </Link>
          </div>
        </div>
      </Carousel>

      {/* Features Section */}
      <div className="features-section">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <ClockCircleOutlined className="feature-icon" />
              <Title level={4}>Fast Delivery</Title>
              <Text>Get your food delivered in under 30 minutes</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <StarFilled className="feature-icon" />
              <Title level={4}>Premium Quality</Title>
              <Text>Only the freshest ingredients used</Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <ShoppingOutlined className="feature-icon" />
              <Title level={4}>Easy Ordering</Title>
              <Text>Simple online ordering process</Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Meals from API */}
      <Divider orientation="center">
        <Title level={2}>Our Signature Dishes</Title>
      </Divider>
      
      {featuredMeals.length > 0 ? (
        <Row gutter={[24, 24]} justify="center" className="featured-meals">
          {featuredMeals.map(meal => (
            <Col key={meal.idMeal} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={
                  <img 
                    alt={meal.strMeal} 
                    src={meal.strMealThumb || 'https://img.freepik.com/free-photo/flat-lay-table-full-delicious-food_23-2149141303.jpg'} 
                    className="meal-image"
                  />
                }
                actions={[
                  <Button 
                  style={{borderRadius:'0px'}}
                    type='primary' 
                    size='large'
                    onClick={() => navigate('/product')}
                  >
                    Order Now
                  </Button>
                ]}
              >
                <Meta
                  title={meal.strMeal}
                  description={meal.strCategory}
                />
                <div className="meal-footer">
                  <Text strong>${(meal.price || Math.floor(Math.random() * 50000) + 10000).toLocaleString()}</Text>
                  <div className="rating">
                    <StarFilled style={{ color: '#faad14' }} />
                    <Text>{(Math.random() * 0.5 + 4.5).toFixed(1)}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="no-meals-message">
          <Text>Our menu is currently being prepared. Please check back soon!</Text>
        </div>
      )}

      {/* Call to Action */}
      <div className="cta-section">
        <Title level={2}>Ready to experience delicious food?</Title>
        <Button 
          style={{borderRadius:'0px'}}
          type="primary" 
          size="large" 
          onClick={() => navigate('/product')}
        >
          Browse Full Menu
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;