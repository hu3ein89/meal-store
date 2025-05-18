import React, { useEffect, useState } from "react";
import '../css/ProductPage.css'
import {
    Button,
    Card,
    Col,
    Empty,
    Input,
    Row,
    Select,
    Spin,
    Typography,
    message,
    Rate,
    Modal,
    Divider,
    Slider,
    Pagination,
    Tooltip,
    Space,
    Badge,
    Drawer
} from "antd";
import {
    ShoppingOutlined,
    LoadingOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/Cartslice";
import {
    setSearchTerm,
    setSelectedCategory,
    fetchMeals,
    setPriceRange,
    setSortOption,
    setCurrentPage
} from "../slices/MealSlice";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Cloudinary Configuration
const CLOUD_NAME = 'your-cloud-name'; // Replace with your Cloudinary cloud name
const getOptimizedImageUrl = (originalUrl, width = 400) => {
  if (!originalUrl) return originalUrl;
  
  // Skip if already a Cloudinary URL
  if (originalUrl.includes('res.cloudinary.com')) return originalUrl;
  
  // Encode the original URL and construct Cloudinary URL
  const encodedUrl = encodeURIComponent(originalUrl);
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/q_auto,f_webp,w_${width}/${encodedUrl}`;
};

const ProductPage = () => {
    const dispatch = useDispatch();
    const {
        items,
        displayedItems,
        loading,
        error,
        categories,
        searchTerm,
        selectedCategory,
        priceRange,
        sortOption,
        currentPage,
        pageSize,
        totalItems
    } = useSelector(state => state.meals);
    const cartItems = useSelector(state => state.cart.items);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [mobileFiltersVisible, setMobileFiltersVisible] = useState(false);
    const isLoggedIn = useSelector(state => state.auth?.isLoggedIn || false);
    const mealsToRender = displayedItems.length > 0 ? displayedItems : items;

    useEffect(() => {
        dispatch(fetchMeals());
    }, [dispatch]);

    const getCartQuantity = (mealId) => {
        const item = cartItems.find(item => item.id === mealId);
        return item ? item.quantity : 0;
    };

    const handleAddToCart = (meal) => {
        if (isLoggedIn) {
            dispatch(addToCart({
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
                price: meal.price || Math.floor(Math.random() * 50000) + 10000,
                quantity: 1
            }));
            message.success(`${meal.strMeal} added to cart`);
        } else {
            message.warning('Please login to add items to cart');
        }
    };

    const handlePriceFilterChange = (value) => {
        dispatch(setPriceRange(value));
    };

    const handleSortChange = (value) => {
        dispatch(setSortOption(value));
        dispatch(setCurrentPage(1));
    };

    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
    );

    if (error) return <div>Error: {error}</div>;

    const FiltersContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Sort By</Text>
                <Select
                    placeholder="Sort options"
                    style={{ width: '100%' }}
                    size="middle"
                    onChange={handleSortChange}
                    value={sortOption || 'default'}
                >
                    <Option value="default">Sort by Default</Option>
                    <Option value="price_asc">Price: Low to High</Option>
                    <Option value="price_desc">Price: High to Low</Option>
                    <Option value="name_asc">A-Z</Option>
                    <Option value="name_desc">Z-A</Option>
                </Select>
            </div>

            <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Price Range</Text>
                <Slider
                    range
                    min={0}
                    max={100000}
                    value={priceRange}
                    onChange={handlePriceFilterChange}
                    style={{ width: '100%' }}
                    trackStyle={[{ backgroundColor: '#1890ff' }]}
                    handleStyle={[
                        { borderColor: '#1890ff' },
                        { borderColor: '#1890ff' }
                    ]}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text>${priceRange[0].toLocaleString()}</Text>
                    <Text>${priceRange[1].toLocaleString()}</Text>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <Title level={2} style={{ fontFamily: 'sans-serif' }}>SEAWEED MENU</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={16} md={18}>
                    <Search
                        placeholder="Search meals..."
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={(value) => dispatch(setSearchTerm(value))}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                        value={searchTerm}
                    />
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <Select
                        showSearch
                        placeholder="All Categories"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={(value) => dispatch(setSelectedCategory(value))}
                        value={selectedCategory}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="">All Categories</Option>
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={0} sm={0} md={6} lg={5} xl={4}>
                    <Card
                        title={<><FilterOutlined /> Filters</>}
                        headStyle={{ background: '#f0f2f5', fontWeight: 'bold' }}
                        bodyStyle={{ padding: '16px' }}
                        style={{ position: 'sticky', top: '20px' }}
                    >
                        <FiltersContent />
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={0} style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={() => setMobileFiltersVisible(true)}
                        style={{ width: '100%' }}
                        size="large"
                    >
                        Show Filters
                    </Button>
                </Col>

                <Col xs={24} sm={24} md={18} lg={19} xl={20}>
                    <Row gutter={[16, 16]}>
                        {mealsToRender.length > 0 ? (
                            mealsToRender.map(meal => (
                                <Col xs={24} sm={12} md={8} lg={6} key={meal.idMeal}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    alt={meal.strMeal}
                                                    src={getOptimizedImageUrl(meal.strMealThumb)}
                                                    style={{
                                                        height: 200,
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '5px'
                                                    }}
                                                    onClick={() => setSelectedMeal(meal)}
                                                />
                                                {meal.strTags && (
                                                    <Tooltip title={meal.strTags.split(',').join(', ')}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            background: 'rgba(0,0,0,0.7)',
                                                            color: 'white',
                                                            padding: '2px 8px',
                                                            borderRadius: 4,
                                                            fontSize: 12
                                                        }}>
                                                            {meal.strTags.split(',').shift()}
                                                        </div>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        }
                                    >
                                        <Card.Meta
                                            title={<Text strong ellipsis>{meal.strMeal}</Text>}
                                            description={
                                                <Space direction="vertical" size={2}>
                                                    <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                                                        ${(meal.price || 0).toLocaleString()}
                                                    </Text>
                                                    <Text type="secondary">{meal.strCategory}</Text>
                                                    <Rate
                                                        disabled
                                                        defaultValue={Math.floor(Math.random() * 3) + 3}
                                                        style={{ fontSize: 14 }}
                                                    />
                                                    <Badge
                                                        count={getCartQuantity(meal.idMeal)}
                                                        offset={[-10, 10]}
                                                        style={{ backgroundColor: '#5100aa' }}
                                                    >
                                                        <Button
                                                            type="primary"
                                                            block
                                                            icon={<ShoppingOutlined />}
                                                            onClick={() => handleAddToCart(meal)}
                                                            disabled={!isLoggedIn}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </Badge>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Empty description="No meals found matching your criteria" />
                            </Col>
                        )}
                    </Row>

                    {mealsToRender.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Pagination
                                current={currentPage}
                                total={totalItems}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                rel='nofollow'
                            />
                        </div>
                    )}
                </Col>
            </Row>

            <Drawer
                title="Filters"
                placement="left"
                closable={true}
                onClose={() => setMobileFiltersVisible(false)}
                open={mobileFiltersVisible}
                width={300}
            >
                <FiltersContent />
            </Drawer>

            {selectedMeal && (
                <Modal
                    title={selectedMeal.strMeal}
                    open={!!selectedMeal}
                    onCancel={() => setSelectedMeal(null)}
                    footer={[
                        <Button
                            key="addToCart"
                            type="primary"
                            icon={<ShoppingOutlined />}
                            onClick={() => {
                                handleAddToCart(selectedMeal);
                                setSelectedMeal(null);
                            }}
                            disabled={!isLoggedIn}
                        >
                            Add to Cart
                        </Button>
                    ]}
                    width={800}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <img
                                src={getOptimizedImageUrl(selectedMeal.strMealThumb, 800)}
                                alt={selectedMeal.strMeal}
                                style={{ width: '100%', borderRadius: 8 }}
                            />
                        </Col>
                        <Col span={12}>
                            <Text strong>Category: </Text>
                            <Text>{selectedMeal.strCategory}</Text>
                            <Divider />
                            <Text strong>Price: </Text>
                            <Text style={{ color: '#1890ff' }}>
                                ${(selectedMeal.price || 0).toLocaleString()}
                            </Text>
                            <Divider />
                            <Text strong>Description:</Text>
                            <p style={{ marginTop: 8 }}>
                                {selectedMeal.strInstructions?.substring(0, 300)}...
                            </p>
                        </Col>
                    </Row>
                    <Divider />
                    <Text strong>Ingredients:</Text>
                    <ul style={{ columns: 2 }}>
                        {Array.from({ length: 20 }).map((_, i) => {
                            const ingredient = selectedMeal[`strIngredient${i + 1}`];
                            const measure = selectedMeal[`strMeasure${i + 1}`];
                            return ingredient ? (
                                <li key={i}>
                                    {ingredient} - {measure}
                                </li>
                            ) : null;
                        })}
                    </ul>
                </Modal>
            )}
        </div>
    );
};

export default ProductPage;