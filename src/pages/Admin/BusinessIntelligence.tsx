import React, { useEffect } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useProductStore } from '../../store/useProductStore';
import { formatPrice } from '../../utils/formatters';
import placeholderImg from '../../utils/placeholder';

const formatMonth = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });
};

const BusinessIntelligence: React.FC = () => {
  const { orders, fetchOrders } = useOrderStore();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  useEffect(() => {
    const handler = () => fetchOrders();
    window.addEventListener('orders-updated', handler);
    return () => window.removeEventListener('orders-updated', handler);
  }, [fetchOrders]);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalRevenue = delivered.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const customerCount = new Set(orders.map((o) => o.customer.id)).size;
  const avgOrderValue = delivered.length
    ? totalRevenue / delivered.length
    : 0;

  const monthlyMap: Record<string, number> = {};
  delivered.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + (o.total ?? 0);
  });
  const monthlyRevenue = Object.entries(monthlyMap).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const salesMap: Record<
    number,
    { name: string; qty: number; imageUrl?: string }
  > = {};
  delivered.forEach((o) => {
    o.items.forEach((item) => {
      if (!salesMap[item.productId]) {
        salesMap[item.productId] = {
          name: item.Product.name,
          qty: 0,
          imageUrl: item.Product.imageUrl,
        };
      }
      salesMap[item.productId].qty += item.quantity;
    });
  });
  const topProducts = Object.entries(salesMap)
    .map(([id, data]) => ({ id: Number(id), ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Inteligencia de Negocios
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Clientes Únicos</p>
            <p className="text-2xl font-bold text-gray-900">{customerCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Órdenes Entregadas</p>
            <p className="text-2xl font-bold text-gray-900">{delivered.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(avgOrderValue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Productos
            </h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.imageUrl || placeholderImg}
                        alt={p.name}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.onerror = null;
                          t.src = placeholderImg;
                        }}
                      />
                      <p className="font-medium text-gray-900">{p.name}</p>
                    </div>
                    <span className="text-sm text-gray-500">{p.qty} uds</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay datos</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingresos por Mes
            </h2>
            <div className="space-y-2">
              {monthlyRevenue.length > 0 ? (
                monthlyRevenue.map(([m, v]) => (
                  <div
                    key={m}
                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                  >
                    <p className="capitalize text-gray-700">{formatMonth(m)}</p>
                    <span className="font-medium text-gray-900">
                      {formatPrice(v)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay datos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;
