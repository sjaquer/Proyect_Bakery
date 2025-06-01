import React from 'react';
import { Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  large?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, large = false }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendiente',
          color: 'bg-warning-100 text-warning-800 border-warning-300',
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          label: 'Aceptado',
          color: 'bg-secondary-100 text-secondary-800 border-secondary-300',
        };
      case 'dispatched':
        return {
          icon: Truck,
          label: 'Despachado',
          color: 'bg-primary-100 text-primary-800 border-primary-300',
        };
      case 'concluded':
        return {
          icon: Package,
          label: 'Concluido',
          color: 'bg-success-100 text-success-800 border-success-300',
        };
      case 'canceled':
        return {
          icon: XCircle,
          label: 'Cancelado',
          color: 'bg-error-100 text-error-800 border-error-300',
        };
      default:
        return {
          icon: Clock,
          label: 'Desconocido',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  const { icon: Icon, label, color } = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center ${color} ${large ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs'} rounded-full border`}>
      <Icon className={`${large ? 'h-5 w-5 mr-2' : 'h-4 w-4 mr-1'}`} />
      {label}
    </div>
  );
};

export default OrderStatusBadge;