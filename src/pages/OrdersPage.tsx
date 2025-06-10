// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from 'react';

type OrderItem = { productId: number; quantity: number; price: number; };
type Order = { id: number; status: string; items: OrderItem[]; createdAt: string; };

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(await res.json());
    })();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
      {orders.map(o => (
        <div key={o.id} className="border p-3 mb-3">
          <div>#{o.id} - {new Date(o.createdAt).toLocaleString()}</div>
          <div>Estado: {o.status}</div>
          {o.items.map(i => (
            <div key={i.productId}>
              Producto {i.productId} x {i.quantity} (${i.price})
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
