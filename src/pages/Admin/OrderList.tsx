// src/pages/Admin/OrderList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { updateOrderStatus } from '../../api/orderService';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/shared/Button';
import WhatsAppIcon from '../../components/shared/WhatsAppIcon';
import {
  formatPrice,
  formatOrderStatus,
  getStatusColor,
} from '../../utils/formatters';
import type { Order } from '../../types/order';

const OrderList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const { fetchOrders: refreshStore } = useOrderStore();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'rejected'];

  useEffect(() => {
    // 1) Si no hay usuario, lo mandamos a login
    if (!user) {
      navigate('/login');
      return;
    }
    // 2) Si no es admin, al home
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    // 3) Ya está todo validado: cargamos pedidos
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>('/orders/all?expand=customer,items');
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = () => fetchOrders();
    window.addEventListener('orders-updated', handler);
    return () => window.removeEventListener('orders-updated', handler);
  }, []);

  const advanceStatus = async (orderId: string, current: string) => {
    const idx = statuses.indexOf(current);
    if (idx === -1 || idx === statuses.length - 1) return;
    const next = statuses[idx + 1];
    try {
      await updateOrderStatus(orderId, next as Order['status']);
      await refreshStore();
      fetchOrders();
      window.dispatchEvent(new CustomEvent('orders-updated'));
    } catch (err: any) {
      console.error('Error updating status', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const rejectOrder = async (orderId: string) => {
    if (!window.confirm('¿Rechazar este pedido?')) return;
    try {
      await updateOrderStatus(orderId, 'rejected');
      await refreshStore();
      fetchOrders();
      window.dispatchEvent(new CustomEvent('orders-updated'));
    } catch (err: any) {
      console.error('Error rejecting order', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Pedidos</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">Error loading orders: {error}</p>
          </div>
        )}

        {loading ? (
          <p>Cargando pedidos…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {statuses.map((st) => (
              <div key={st} className="bg-white rounded-lg p-4 shadow">
                <h3 className="text-sm font-semibold text-center mb-2">
                  {formatOrderStatus(st)}
                </h3>
                <div className="space-y-2">
                  {orders.filter((o) => o.status === st).map((o) => (
                    <div
                      key={o.id}
                      className="bg-gray-50 rounded p-3 shadow border space-y-2"
                    >
                      <div className="text-sm font-medium">#{String(o.id).slice(-8)}</div>
                      <div className="text-xs text-gray-500">
                        {o.customer?.name || o.customer?.id || '—'}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{o.customer?.phone || '—'}</span>
                        <a
                          href={`https://wa.me/${o.customer?.phone || ''}`}
                          target="_blank"
                          rel="noopener"
                          aria-label="Message customer on WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4 text-green-600" />
                        </a>
                      </div>
                      <div className="text-xs text-gray-500">
                        {o.customer?.address || '—'}
                      </div>
                      <ul className="text-xs text-gray-700 list-disc pl-4">
                        {o.items?.map(item => (
                          <li key={item.id}>
                            {item.Product?.name || '—'} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                      <div className="text-sm font-semibold">
                        {formatPrice(o.total)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(o.status)}`}
                        >
                          {formatOrderStatus(o.status)}
                        </span>
                        <div className="flex gap-2">
                          {o.status === 'pending' && (
                            <Button size="xs" variant="danger" onClick={() => rejectOrder(o.id)}>
                              Rechazar
                            </Button>
                          )}
                          <Button
                            size="xs"
                            onClick={() => advanceStatus(o.id, o.status)}
                            disabled={o.status === 'delivered' || o.status === 'cancelled' || o.status === 'rejected'}
                          >
                            Avanzar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
