import React from 'react';
import { useStore } from '../../store/useStore'; // Corregida la importación
import OrderCard from './OrderCard';
import { Order, OrderStatus } from '../../types';

interface OrdersBoardProps {
  orders: Order[];
  onAdvanceOrder: (orderId: string) => void;
  onRevertOrder: (orderId: string) => void;
}

const OrdersBoard: React.FC<OrdersBoardProps> = ({ 
  orders, 
  onAdvanceOrder, 
  onRevertOrder 
}) => {
  const sections: OrderStatus[] = ['pending', 'accepted', 'dispatched', 'concluded'];
  
  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };
  
  const getSectionTitle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pendientes';
      case 'accepted': return 'Aceptados';
      case 'dispatched': return 'Despachados';
      case 'concluded': return 'Concluidos';
      case 'canceled': return 'Cancelados';
      default: return '';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sections.map((status) => {
        const statusOrders = getOrdersByStatus(status);
        
        return (
          <div key={status} className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-white p-3 rounded-t-lg shadow-sm border-b">
              <h3 className="font-semibold text-gray-800">{getSectionTitle(status)}</h3>
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {statusOrders.length}
              </span>
            </div>
            
            <div className="bg-gray-100 flex-grow p-4 rounded-b-lg overflow-y-auto max-h-[calc(100vh-240px)]">
              <div className="space-y-4">
                {statusOrders.length > 0 ? (
                  statusOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onAdvance={onAdvanceOrder}
                      onRevert={onRevertOrder}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No hay pedidos {getSectionTitle(status).toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersBoard;