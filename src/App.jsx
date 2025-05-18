import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CartPage from './pages/CartPage';
import LandingPage from './pages/LandingPage'
import ProductPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRoot from './components/PrivateRoute';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Affix, Spin } from 'antd';
import CustomFooter from './components/CustomFooter';

const { Content } = Layout;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            borderRadius: '0px',
          },
        },
      }}
    >
      <Router>
        <Layout className='layout' style={{ minHeight: '100vh' }}>
          <Affix>
            <Header />
          </Affix>
          <Content style={{
            padding: '0 30px',
            margin: '24px 0',
            flex: 1
          }}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={
                <React.Suspense fallback={<Spin size="large" />}>
                  <LandingPage />
                </React.Suspense>
              } />
              <Route path="/Product" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/checkout"
                element={<PrivateRoot><CheckoutPage /></PrivateRoot>}
              />
              <Route
                path="/dashboard"
                element={<PrivateRoot><DashboardPage /></PrivateRoot>}
              />
              <Route path="*" element={<Navigate to='/' replace />} />
            </Routes>
          </Content>
          <CustomFooter />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;