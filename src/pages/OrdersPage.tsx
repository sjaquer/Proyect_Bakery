// src/pages/OrdersPage.tsx

import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const user = useStore(state => state.user);
  const customerOrders = useStore(state => state.customerOrders);
  const fetchCustomerOrders = useStore(state => state.fetchCustomerOrders);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCustomerOrders(user.id);
  }, [user, fetchCustomerOrders, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Mis Pedidos</h2>
      {customerOrders.length === 0 ? (
        <p>No tienes pedidos todavía.</p>
      ) : (
        customerOrders.map(order => (
          <div key={order.id} className="border rounded p-4 mb-4">
            <p>
              <span className="font-medium">Pedido #{order.id}</span>{' '}
              <span className="text-gray-600">
                ({new Date(order.createdAt).toLocaleString()})
              </span>
            </p>
            <p>Estado: <strong>{order.status}</strong></p>
            <p>Total: ${order.total}</p>
            <div className="mt-2">
              <p className="font-medium">Productos:</p>
              <ul className="list-disc list-inside">
                {order.orderItems.map((item: any) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product.name} (${item.priceUnit})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
