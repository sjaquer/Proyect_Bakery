// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import ProductManagementPage from './pages/ProductManagementPage'; // <— nuevo
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/common/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<PrivateRoute role="customer"><OrdersPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute role="admin"><ProductManagementPage /></PrivateRoute> } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
    
  );
};

export default App;
