import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Affix, Spin } from 'antd';

// Lazy-loaded components
const CartPage = React.lazy(() => import('./pages/CartPage'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const ProductPage = React.lazy(() => import('./pages/ProductsPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const PrivateRoot = React.lazy(() => import('./components/PrivateRoute'));
const Header = React.lazy(() => import('./components/Header'));
const CustomFooter = React.lazy(() => import('./components/CustomFooter'));

const { Content } = Layout;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Custom loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column' 
  }}>
    <Spin size="large" />
    <p style={{ marginTop: 16 }}>Loading...</p>
  </div>
);

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
        <Suspense fallback={<LoadingFallback />}>
          <Layout className='layout' style={{ minHeight: '100vh' }}>
            <Affix>
              <Suspense fallback={<div style={{ height: '64px', background: '#001529' }} />}>
                <Header />
              </Suspense>
            </Affix>
            <Content style={{
              padding: '0 30px',
              margin: '24px 0',
              flex: 1
            }}>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LandingPage />
                  </Suspense>
                } />
                <Route path="/Product" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProductPage />
                  </Suspense>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LoginPage />
                  </Suspense>
                } />
                <Route path="/register" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <RegisterPage />
                  </Suspense>
                } />
                <Route path="/cart" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CartPage />
                  </Suspense>
                } />
                <Route
                  path="/checkout"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PrivateRoot>
                        <CheckoutPage />
                      </PrivateRoot>
                    </Suspense>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <PrivateRoot>
                        <DashboardPage />
                      </PrivateRoot>
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to='/' replace />} />
              </Routes>
            </Content>
            <Suspense fallback={null}>
              <CustomFooter />
            </Suspense>
          </Layout>
        </Suspense>
      </Router>
    </ConfigProvider>
  );
}

export default App;