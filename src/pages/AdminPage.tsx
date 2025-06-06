// src/pages/AdminPage.tsx

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const user = useStore(state => state.user);
  const login = useStore(state => state.login);
  const fetchAllOrders = useStore(state => state.fetchAllOrders);
  const allOrders = useStore(state => state.allOrders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  const logout = useStore(state => state.logout);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllOrders();
    }
  }, [user, fetchAllOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // fetchAllOrders() se realizará en el useEffect cuando user.role sea admin
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas.');
    }
  };

  // Si no hay usuario o no es admin, mostramos el form de login
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto p-4 max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login Admin</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Si user.role === 'admin', mostramos el panel
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Panel de Administración</h2>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      {allOrders.length === 0 ? (
        <p>No hay órdenes.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map(order => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.customer.name}</td>
                <td className="border px-4 py-2">${order.total}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="inPreparation">In Preparation</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
