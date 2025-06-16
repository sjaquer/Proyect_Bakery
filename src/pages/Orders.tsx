// src/pages/Orders.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import Button from '../components/shared/Button';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  formatPrice,
  formatDate,
  formatOrderStatus,
  getStatusColor
} from '../utils/formatters';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import placeholderImg from '../utils/placeholder';

const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { orders, isLoading, error, fetchOrders, deleteOrder } = useOrderStore();
  const [guestOrders, setGuestOrders] = useState<typeof orders>([]);
  const location = useLocation();
  const [newOrder, setNewOrder] = useState<typeof orders[0] | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      // Carga los pedidos de invitado desde localStorage
      const stored = JSON.parse(localStorage.getItem('guest_orders') || '[]');
      setGuestOrders(stored);
    }
  }, [user, fetchOrders]);

  useEffect(() => {
    const order = (location.state as any)?.newOrder;
    if (order) {
      setNewOrder(order);
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si hay usuario, muestro orders de la API; si no, los de localStorage
  const displayOrders = user ? orders : guestOrders;

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Cancelar este pedido?')) return;
    try {
      await deleteOrder(id);
      if (!user) {
        setGuestOrders(prev => prev.filter(o => o.id !== id));
      }
    } catch {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis pedidos</h1>

        {isLoading && user ? (
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
        ) : error && user ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error al cargar pedidos: {error}</p>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aún no tienes pedidos
            </h2>
            <p className="text-gray-600">
              Cuando hagas tu primer pedido aparecerá aquí.
            </p>
            <Button onClick={() => navigate('/shop')} className="mt-6">
              Ir a la tienda
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {newOrder && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h2 className="font-semibold text-green-800 mb-1">
                  ¡Gracias por tu compra!
                </h2>
                <p className="text-sm text-green-700">
                  Pedido #{String(newOrder.id).slice(-8)} por{' '}
                  {formatPrice(newOrder.total)}
                </p>
                <p className="text-sm text-gray-600">
                  Esperando confirmación de la tienda...
                </p>
              </div>
            )}
            {displayOrders.map((order) => (
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
                          Pedido #{String(order.id).slice(-8)}
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
                    <h4 className="font-medium text-gray-900 mb-3">Artículos:</h4>
                    <div className="space-y-2">
                      {order.OrderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={resolveImageUrl(item.Product.imageUrl)}
                              alt={item.Product.name}
                              className="h-10 w-10 object-cover rounded"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = placeholderImg;
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.Product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Cant: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
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
                            Dirección de entrega:
                          </p>
                          <p className="text-gray-600">
                            {order.customerInfo.address || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Contacto:</p>
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
                  {order.status === 'pending' && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(order.id)}
                      >
                        Cancelar pedido
                      </Button>
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
