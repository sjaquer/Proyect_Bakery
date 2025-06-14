import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/Layout/AdminSidebar';
import { useAuthStore } from './store/useAuthStore';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import ProductList from './pages/Admin/ProductList';
import ProductEdit from './pages/Admin/ProductEdit';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import OrderList from './pages/Admin/OrderList';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Fresh Baked
              <span className="text-amber-600 block">Every Day</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              From artisan breads to decadent desserts, discover our handcrafted selection 
              of fresh baked goods made with premium ingredients and traditional techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
              >
                Shop Now
              </a>
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-600 text-base font-medium rounded-lg text-amber-600 bg-transparent hover:bg-amber-600 hover:text-white transition-colors duration-200"
              >
                View Menu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">Quality ingredients, traditional methods, modern convenience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Daily</h3>
              <p className="text-gray-600">All our products are baked fresh every morning using traditional recipes.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery service to bring our bakery to your door.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">We use only the finest ingredients sourced from trusted suppliers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            
            {/* Checkout y Orders ya no requieren login */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders"  element={<Orders  />} />
            
{/* Admin: layout con sidebar + contenido anidado */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <div className="flex">
                    <AdminSidebar />
                    <div className="flex-1 p-6 bg-gray-50">
                      <Outlet />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/create" element={<ProductEdit />} />
              <Route path="products/edit/:id" element={<ProductEdit />} />
              <Route path="orders" element={<OrderList />} />
            </Route>
       </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
