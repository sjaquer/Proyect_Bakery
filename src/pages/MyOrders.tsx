import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUser } from '../api/orderService';
import { mapApiOrder } from '../utils/mapApiOrder';
import type { Order } from '../types/order';
import { formatPrice, formatDate, formatOrderStatus } from '../utils/formatters';

const MyOrders: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const fetchOrders = async () => {
      try {
        const resp = await getOrdersByUser(user.id);
        setOrders(resp.data.map(mapApiOrder));
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Mis pedidos</h1>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border p-4 rounded">
            <div className="flex justify-between">
              <span>#{String(order.id).slice(-8)}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold">{formatPrice(order.total ?? 0)}</span>
              <span>{formatOrderStatus(order.status)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
