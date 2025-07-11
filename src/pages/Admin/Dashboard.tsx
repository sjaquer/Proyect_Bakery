import React, { useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice } from '../../utils/formatters';
import placeholderImg from '../../utils/placeholder';

const Dashboard: React.FC = () => {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  useEffect(() => {
    const handler = () => fetchOrders();
    window.addEventListener('orders-updated', handler);
    return () => window.removeEventListener('orders-updated', handler);
  }, [fetchOrders]);

  const today = new Date().toISOString().slice(0, 10);
  const dailyRevenue = orders
    .filter(
      (order) =>
        order.status === 'delivered' && order.createdAt.slice(0, 10) === today
    )
    .reduce((sum, order) => sum + (order.total ?? 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const stats = [
    {
      title: 'Total de Productos',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total de Pedidos',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Pedidos Pendientes',
      value: pendingOrders,
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      title: 'Ingresos de Hoy',
      value: formatPrice(dailyRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Recientes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedidos Recientes</h2>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Pedido #{String(order.id).slice(-8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.Customer?.name || 'Cliente'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aún no hay pedidos</p>
              )}
            </div>
          </div>

          {/* Estado de Stock */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado de Stock</h2>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => {
                  const stock = product.stock;
                  const base = 'flex items-center justify-between p-4 border rounded-lg';
                  let color = '';
                  let textColor = '';
                  if (stock === 0) {
                    color = 'border-red-200 bg-red-50';
                    textColor = 'text-red-600';
                  } else if (stock < 10) {
                    color = 'border-yellow-200 bg-yellow-50';
                    textColor = 'text-yellow-600';
                  } else {
                    color = 'border-green-200 bg-green-50';
                    textColor = 'text-green-600';
                  }
                  return (
                    <div key={product.id} className={`${base} ${color}`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imageUrl || placeholderImg}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = placeholderImg;
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${textColor}`}>
                        {stock === 0 ? 'Sin stock' : `${stock} uds`}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No hay productos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;