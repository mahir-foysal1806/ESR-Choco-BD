import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'));
const TrackOrder = lazy(() => import('./pages/TrackOrder.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'));
const AdminProducts = lazy(() => import('./admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./admin/AdminOrders.jsx'));
const AdminReviews = lazy(() => import('./admin/AdminReviews.jsx'));
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'));

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            style={{
              minHeight: '50vh',
              display: 'grid',
              placeItems: 'center',
              color: '#765044',
              fontSize: '14px',
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success/:orderId" element={<OrderSuccess />} />
            <Route path="track" element={<TrackOrder />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="admin/login" element={<AdminLogin />} />

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
