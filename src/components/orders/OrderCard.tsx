import React from 'react';
import { ChevronRight, ChevronLeft, Clock, Package, MapPin, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onAdvance: (orderId: string) => void;
  onRevert: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAdvance, onRevert }) => {
  const canAdvance = order.status !== 'concluded' && order.status !== 'canceled';
  const canRevert = order.status !== 'pending' && order.status !== 'canceled';
  
  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Aceptar';
      case 'accepted': return 'Despachar';
      case 'dispatched': return 'Concluir';
      default: return '';
    }
  };
  
  const getPreviousStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'accepted': return 'Pendiente';
      case 'dispatched': return 'Aceptado';
      case 'concluded': return 'Despachado';
      default: return '';
    }
  };
  
  const calculateElapsedTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  const handleSendWhatsapp = () => {
    const phone = order.customer.whatsapp.replace(/\+/g, '');
    const message = `Hola ${order.customer.name}, sobre tu pedido #${order.id}...`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-primary-700 animate-fade-in">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Pedido #{order.id}
            </h3>
            <p className="text-sm text-gray-500">
              {format(order.createdAt, 'dd/MM/yyyy HH:mm')}
              {' • '}
              <span className="inline-flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {calculateElapsedTime(order.createdAt)}
              </span>
            </p>
          </div>
          <OrderStatusBadge status={order.status} large />
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente:</h4>
          <div className="text-sm text-gray-600">
            <p>{order.customer.name}</p>
            <p>{order.customer.whatsapp}</p>
            {order.customer.address && (
              <p className="flex items-start mt-1">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-400" />
                {order.customer.address}
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
          <ul className="text-sm">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                <span>{item.quantity}x {item.product.name}</span>
                <span className="font-medium">S/ {(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center mb-1 font-medium">
          <span>Total:</span>
          <span className="text-primary-700">S/ {order.totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
          <span>Método de pago:</span>
          <span className="capitalize">{order.payment.method}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span>
            {order.isDelivery ? (
              <span className="flex items-center text-gray-600">
                <Package className="h-4 w-4 mr-1" />
                Delivery {order.estimatedTime && `(${order.estimatedTime} min)`}
              </span>
            ) : (
              <span className="flex items-center text-gray-600">
                <Package className="h-4 w-4 mr-1" />
                Recoger en tienda
              </span>
            )}
          </span>
          <button
            onClick={handleSendWhatsapp}
            className="text-primary-600 hover:text-primary-800 flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            WhatsApp
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 flex justify-between">
        <button
          onClick={() => onRevert(order.id)}
          disabled={!canRevert}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            canRevert
              ? 'bg-white border border-error-300 text-error-600 hover:bg-error-50'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {getPreviousStatus(order.status)}
        </button>
        
        <button
          onClick={() => onAdvance(order.id)}
          disabled={!canAdvance}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            canAdvance
              ? 'bg-primary-700 text-white hover:bg-primary-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {getNextStatus(order.status)}
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default OrderCard;