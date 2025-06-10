// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';

type Order = { id: number; status: string; customerId: number; items: any[]; };

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/all`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(await res.json());
    })();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel Admin - Órdenes</h1>
      {orders.map(o => (
        <div key={o.id} className="border p-3 mb-3">
          <div>Orden #{o.id} - Cliente {o.customerId} - Estado: {o.status}</div>
          <select
            value={o.status}
            onChange={e => updateStatus(o.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
