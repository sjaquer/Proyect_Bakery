import React from 'react';
import { CreditCard, Package, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../../types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-primary-100 p-3 mr-4">
          <DollarSign className="h-6 w-6 text-primary-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Ventas totales</p>
          <p className="text-2xl font-semibold text-gray-800">
            S/ {stats.totalSales.toLocaleString('es-PE')}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-secondary-100 p-3 mr-4">
          <Package className="h-6 w-6 text-secondary-800" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Pedidos</p>
          <p className="text-2xl font-semibold text-gray-800">
            {stats.totalOrders.toLocaleString('es-PE')}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-accent-300 p-3 mr-4">
          <CreditCard className="h-6 w-6 text-accent-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Ticket promedio</p>
          <p className="text-2xl font-semibold text-gray-800">
            S/ {stats.averageOrderValue.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className="rounded-full bg-success-100 p-3 mr-4">
          <TrendingUp className="h-6 w-6 text-success-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Productos vendidos</p>
          <p className="text-2xl font-semibold text-gray-800">
            {stats.topProducts.reduce((acc, prod) => acc + prod.totalSold, 0).toLocaleString('es-PE')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;