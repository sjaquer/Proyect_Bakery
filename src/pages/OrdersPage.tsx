import React from 'react';
import Layout from '../components/common/Layout';
import OrdersBoard from '../components/orders/OrdersBoard';
import useStore from '../store/useStore';

const OrdersPage: React.FC = () => {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  
  const handleAdvanceOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    
    let nextStatus;
    switch (order.status) {
      case 'pending':
        nextStatus = 'accepted';
        break;
      case 'accepted':
        nextStatus = 'dispatched';
        break;
      case 'dispatched':
        nextStatus = 'concluded';
        break;
      default:
        return;
    }
    
    updateOrderStatus(orderId, nextStatus);
  };
  
  const handleRevertOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    
    let previousStatus;
    switch (order.status) {
      case 'accepted':
        previousStatus = 'pending';
        break;
      case 'dispatched':
        previousStatus = 'accepted';
        break;
      case 'concluded':
        previousStatus = 'dispatched';
        break;
      default:
        return;
    }
    
    updateOrderStatus(orderId, previousStatus);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-600">Administre los pedidos y su estado en tiempo real</p>
        </div>
        
        <OrdersBoard
          orders={orders}
          onAdvanceOrder={handleAdvanceOrder}
          onRevertOrder={handleRevertOrder}
        />
      </div>
    </Layout>
  );
};

export default OrdersPage;