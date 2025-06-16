// src/pages/Admin/OrderList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/shared/Button';
import {
  formatPrice,
  formatOrderStatus,
  getStatusColor,
} from '../../utils/formatters';

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  Customer?: {
    id: number;
    name?: string;
  };
}

const OrderList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

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
      const { data } = await api.get<Order[]>('/orders/all');
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (orderId: number, current: string) => {
    const idx = statuses.indexOf(current);
    if (idx === -1 || idx === statuses.length - 1) return;
    const next = statuses[idx + 1];
    try {
      await api.patch(`/orders/${orderId}/status`, { status: next });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
      );
    } catch (err: any) {
      console.error('Error updating status', err);
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
                      className="bg-gray-50 rounded p-3 shadow border"
                    >
                      <div className="text-sm font-medium">#{String(o.id).slice(-8)}</div>
                      <div className="text-xs text-gray-500">
                        {o.Customer?.name || o.Customer?.id || '—'}
                      </div>
                      <div className="text-sm font-semibold mb-2">
                        {formatPrice(o.total)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(o.status)}`}
                        >
                          {formatOrderStatus(o.status)}
                        </span>
                        <Button
                          size="xs"
                          onClick={() => advanceStatus(o.id, o.status)}
                          disabled={o.status === 'delivered' || o.status === 'cancelled'}
                        >
                          Avanzar
                        </Button>
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
