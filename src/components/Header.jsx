import {
    DashOutlined,
    ProductOutlined,
    HomeOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    MenuOutlined
} from "@ant-design/icons";
import { Menu, Space, Image, Row, Col, Button, Drawer, Tooltip, Avatar } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../slices/AuthorizeSlice";
import { setActiveMenu } from "../slices/UiSlice";
import { useEffect, useState } from "react";
import logo from '../assets/Logo.png';
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const Header = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const activeMenu = useSelector(state => state.ui.activeMenu);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const screens = useBreakpoint();

    const UserAvatar = () => {
        if (!user?.username) return <Avatar icon={<UserOutlined />} />;

        const firstLetter = user.username.charAt(0).toUpperCase();

        // Deterministic color based on username
        function getStableColor(username) {
            // Simple hash function to convert username to a number
            let hash = 0;
            for (let i = 0; i < username.length; i++) {
                hash = username.charCodeAt(i) + ((hash << 5) - hash);
            }

            const hue = Math.abs(hash) % 360; // 0-359
            const saturation = 70 + (Math.abs(hash) % 30); // 70-100%
            const lightness = 40 + (Math.abs(hash) % 30); // 40-70%

            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }

        return (
            <Avatar
                style={{
                    backgroundColor: getStableColor(user.username),
                    color: '#fff', // White text for contrast
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                    cursor: 'pointer'
                }}
            >
                {firstLetter}
            </Avatar>
        );
    };

    useEffect(() => {
        const path = location.pathname;
        let menuKey = 'home';

        if (path.startsWith('/product')) menuKey = 'products';
        else if (path.startsWith('/cart')) menuKey = 'cart';
        else if (path.startsWith('/dashboard')) menuKey = 'dashboard';
        else if (path.startsWith('/login')) menuKey = 'login';
        else if (path.startsWith('/register')) menuKey = 'register';

        dispatch(setActiveMenu(menuKey));
    }, [location, dispatch]);

    const userName = user?.username
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setVisible(false);
    };

    const handleMenuClick = (menu) => {
        dispatch(setActiveMenu(menu.key));
        setVisible(false);
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const createMenuItem = (key, icon, label, path) => ({
        key,
        icon,
        label: (
            <Link to={path}>
                {label}
            </Link>
        ),
        onClick: () => handleMenuClick({ key })
    });

    const commonItems = [
        createMenuItem('home', <HomeOutlined />, 'Home', '/'),
        createMenuItem('products', <ProductOutlined />, 'Products', '/product'),
        createMenuItem('cart', <ShoppingCartOutlined />, 'Cart', '/cart')
    ];

    const authItems = isLoggedIn
        ? [
            {
                key: 'user-menu', // Changed from 'dashboard' to avoid duplicate
                icon: <UserAvatar />,
                children: [
                    {
                        key: 'dashboard', // This is now unique
                        icon: <DashOutlined />,
                        label: <Link to="/dashboard">Dashboard</Link>,
                        onClick: () => handleMenuClick({ key: 'dashboard' })
                    },
                    {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'Logout',
                        onClick: handleLogout
                    }
                ]
            }
        ]
        : [
            createMenuItem('login', <UserOutlined />, 'Login', '/login'),
            createMenuItem('register', <UserOutlined />, 'Register', '/register')
        ];
    const allMenuItems = [...commonItems, ...authItems];

    // Desktop View
    const desktopView = (
        <Row align="middle" style={{ background: '#001529', padding: '0 24px', width: '100%' }}>
            {/* Logo - hidden on mobile */}
            {screens.md && (
                <Col flex="160px">
                    <Image
                        style={{ padding: '10px' }}
                        src={logo}
                        alt='logo'
                        preview={false}
                        width={160}
                        height={60}
                    />
                </Col>
            )}

            {/* Main Navigation */}
            <Col flex="auto">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[activeMenu]}
                    style={{
                        lineHeight: '64px',
                        borderBottom: 'none',
                        justifyContent: 'center'
                    }}
                    items={commonItems}
                />
            </Col>

            {/* Auth Navigation - right aligned */}
            <Col flex="none">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[activeMenu]}
                    stnpm yle={{
                        lineHeight: '64px',
                        borderBottom: 'none',
                        minWidth: '200px',
                        justifyContent: 'flex-end'
                    }}
                    items={authItems}
                />
            </Col>
        </Row>
    );

    // Mobile View
    const mobileView = (
        <Row align="middle" style={{ background: '#001529', padding: '0 16px', width: '100%' }}>
            <Col flex="none">
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={{ color: '#fff', fontSize: '16px' }}
                />
            </Col>

            <Col flex="auto" style={{ textAlign: 'center' }}>
                {!screens.md && (
                    <Image
                        style={{ padding: '10px' }}
                        src={logo}
                        preview={false}
                        width={160}
                        height={60}
                    />
                )}
            </Col>

            <Drawer
                title="Menu"
                placement="left"
                onClose={onClose}
                open={visible}
                styles={{
                    header: { background: '#001529', color: '#fff'  },
                    body: { padding: "24px" },
                    content: { borderRadius: "10px" },
                  }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[activeMenu]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={allMenuItems}
                />
            </Drawer>
        </Row>
    );

    return screens.md ? desktopView : mobileView;
    
};

export default Header;