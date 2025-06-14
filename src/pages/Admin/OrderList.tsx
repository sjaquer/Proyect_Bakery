// src/pages/Admin/OrderList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuthStore } from '../../store/useAuthStore';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import ProtectedRoute from '../../components/Layout/ProtectedRoute';
import Button from '../../components/shared/Button';

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
      // Como es admin, pedimos /orders/all
      const { data } = await api.get<Order[]>('/orders/all');
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Pedidos</h1>

          {error && (
            <p className="text-red-500 mb-4">
              Error loading orders: {error}
            </p>
          )}

          {loading ? (
            <p>Cargando pedidos…</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Usuario</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-2">{o.id}</td>
                    <td className="px-4 py-2">
                      {o.Customer?.name || o.Customer?.id || '—'}
                    </td>
                    <td className="px-4 py-2">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-2">{o.status}</td>
                    <td className="px-4 py-2">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <Button size="sm" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderList;
