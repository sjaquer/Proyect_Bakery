import React, { useEffect, useRef } from 'react';
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
import About from './pages/About';
import Dashboard from './pages/Admin/Dashboard';
import OrderManagement from './pages/Admin/OrderManagement';
import BusinessIntelligence from './pages/Admin/BusinessIntelligence';
import { Phone, MapPin, Mail } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useOrderStore } from './store/useOrderStore';
import type { Order } from './types/order';
import { formatOrderStatus } from './utils/formatters';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://files.catbox.moe/bzfqeb.mp4" type="video/mp4" />
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
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-amber-600 text-base font-medium rounded-lg text-amber-600 bg-transparent hover:bg-amber-600 hover:text-white transition-colors duration-200"
              >
                Conócenos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-600">
              Encuentra nuestra dirección o solicita pedidos grandes por teléfono
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dirección</h3>
              <p className="text-gray-600">Jr. Huancavelica 879</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pedidos grandes</h3>
              <p className="text-gray-600">
                Llámanos al +51 928 527 185 para órdenes de más de 100 unidades.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Correo</h3>
              <p className="text-gray-600">Escríbenos a contacto@panaderia.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { orders, fetchOrders } = useOrderStore();
  const prevOrdersRef = useRef<Order[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  useEffect(() => {
    if (!user) return;

    const handleUpdate = async () => {
      const previous = prevOrdersRef.current;
      await fetchOrders();
      const current = useOrderStore.getState().orders;
      for (const order of current) {
        const prev = previous.find((p) => p.id === order.id);
        if (
          prev &&
          prev.status !== order.status &&
          (order.status === 'received' || order.status === 'ready')
        ) {
          if ('Notification' in window) {
            if (Notification.permission === 'default') {
              await Notification.requestPermission();
            }
            if (Notification.permission === 'granted') {
              new Notification(`Pedido #${String(order.id).slice(-8)}`, {
                body: `Estado actualizado a ${formatOrderStatus(order.status)}`,
              });
            }
          }
        }
      }
      prevOrdersRef.current = current;
    };

    window.addEventListener('orders-updated', handleUpdate);
    return () => window.removeEventListener('orders-updated', handleUpdate);
  }, [user, fetchOrders]);

  useEffect(() => {
    prevOrdersRef.current = orders;
  }, [orders]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
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
                    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
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
              <Route path="intelligence" element={<BusinessIntelligence />} />
            </Route>
       </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
