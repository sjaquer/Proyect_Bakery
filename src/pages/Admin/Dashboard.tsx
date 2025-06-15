import React, { useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { formatPrice } from '../../utils/formatters';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import placeholderImg from '../../utils/placeholder';

const Dashboard: React.FC = () => {
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const outOfStockProducts = products.filter(product => !product.inStock).length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
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
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{String(order.id).slice(-8)}
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
                <p className="text-gray-500">No orders yet</p>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Status</h2>
            <div className="space-y-4">
              {outOfStockProducts.length > 0 ? (
                <>
                  <div className="text-sm text-red-600 font-medium mb-2">
                    Out of Stock ({outOfStockProducts.length})
                  </div>
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <img
                          src={resolveImageUrl(product.imageUrl)}
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
                      <span className="text-sm text-red-600 font-medium">
                        Out of Stock
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <p className="text-green-600 font-medium">All products in stock!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;