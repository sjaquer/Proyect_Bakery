import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/Layout/AdminSidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Products from './pages/Admin/Products';
import ProductEdit from './pages/Admin/ProductEdit';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Admin/Dashboard';
import OrderManagement from './pages/Admin/OrderManagement';
import { useAuthStore } from './store/useAuthStore';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://files.catbox.moe/keh8ur.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Recién horneado
              <span className="text-amber-200 block">cada día</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Desde panes artesanales hasta postres deliciosos, descubre nuestra selección elaborada con ingredientes de primera calidad y técnicas tradicionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
              >
                Comprar ahora
              </a>
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-600 text-base font-medium rounded-lg text-amber-600 bg-transparent hover:bg-amber-600 hover:text-white transition-colors duration-200"
              >
                Ver menú
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-600 text-base font-medium rounded-lg text-amber-600 bg-transparent hover:bg-amber-600 hover:text-white transition-colors duration-200"
              >
                Conócenos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
            <p className="text-lg text-gray-600">Ingredientes de calidad, métodos tradicionales y comodidad moderna</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Frescura diaria</h3>
              <p className="text-gray-600">Todos nuestros productos se hornean cada mañana con recetas tradicionales.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega rápida</h3>
              <p className="text-gray-600">Servicio de entrega rápido y confiable que lleva nuestra panadería a tu puerta.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad premium</h3>
              <p className="text-gray-600">Utilizamos solo los mejores ingredientes de proveedores de confianza.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuthStore();

  // Subscribe to order update events via SSE only when logged in
  useEffect(() => {
    if (!user) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const controller = new AbortController();

    fetch('/api/orders/stream', {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((resp) => {
        if (!resp.body) return;
        const reader = resp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buf = '';
        let eventName = '';
        const read = () => {
          reader.read().then(({ done, value }) => {
            if (done) return;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split(/\r?\n/);
            buf = lines.pop() || '';
            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                if (eventName === 'orders-updated') {
                  window.dispatchEvent(new CustomEvent('orders-updated'));
                }
              } else if (line === '') {
                eventName = '';
              }
            }
            read();
          });
        };
        read();
      })
      .catch((err) => {
        console.error('SSE connection error', err);
      });

    return () => {
      controller.abort();
    };
  }, [user]);

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
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            
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
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductEdit />} />
              <Route path="products/edit/:id" element={<ProductEdit />} />
              <Route path="manage-orders" element={<OrderManagement />} />
            </Route>
       </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
