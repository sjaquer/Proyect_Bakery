import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/shared/Button';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  formatPrice,
  formatDate,
  formatOrderStatus,
  getStatusColor
} from '../utils/formatters';

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;                 // ahora como string para usar slice
  total: number;
  status: string;
  createdAt: string;
  OrderItems: OrderItem[];
  customerInfo?: {            // opcional, en caso de que no venga
    address?: string;
    phone?: string;
    email?: string;
  };
}

const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 1) Si no hay usuario, lo mandamos al login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // 2) Cargamos las órdenes
    const fetch = async () => {
      try {
        const { data } = await api.get<Order[]>('/orders');
        // Aseguramos que id sea string
        const normalized = data.map((o) => ({
          ...o,
          id: String(o.id),
        }));
        setOrders(normalized);
      } catch (err: any) {
        console.error('Error fetching client orders', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading orders: {error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600">
              When you place your first order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.OrderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.customerInfo && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            Delivery Address:
                          </p>
                          <p className="text-gray-600">
                            {order.customerInfo.address || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Contact:</p>
                          <p className="text-gray-600">
                            {order.customerInfo.phone || '—'}
                          </p>
                          <p className="text-gray-600">
                            {order.customerInfo.email || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
