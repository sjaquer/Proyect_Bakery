import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
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
  const [timeframe, setTimeframe] = useState<'month' | 'day'>('month');
  const [visible, setVisible] = useState<Record<number, boolean>>({});

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

  useEffect(() => {
    if (topProducts.length && Object.keys(visible).length === 0) {
      const init: Record<number, boolean> = {};
      topProducts.forEach(p => {
        init[p.id] = true;
      });
      setVisible(init);
    }
  }, [topProducts, visible]);

  const chartData = useMemo(() => {
    if (!delivered.length) return null;
    const keyFor = (d: Date) =>
      timeframe === 'month'
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : d.toISOString().slice(0, 10);
    const productMap: Record<number, Record<string, number>> = {};
    delivered.forEach((o) => {
      const k = keyFor(new Date(o.createdAt));
      o.items.forEach((i) => {
        if (!productMap[i.productId]) productMap[i.productId] = {};
        productMap[i.productId][k] = (productMap[i.productId][k] || 0) + i.quantity;
      });
    });
    const labels = Array.from(
      new Set(
        Object.values(productMap)
          .flatMap((m) => Object.keys(m))
      )
    ).sort();
    const colors = [
      '#ef4444',
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
    ];
    const datasets = topProducts
      .filter((p) => visible[p.id])
      .map((p, idx) => {
        const map = productMap[p.id] || {};
        return {
          label: p.name,
          data: labels.map((l) => map[l] || 0),
          borderColor: colors[idx % colors.length],
          backgroundColor: colors[idx % colors.length],
          tension: 0.3,
        };
      });
    return { labels, datasets };
  }, [delivered, timeframe, topProducts, visible]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { title: { display: true, text: timeframe === 'month' ? 'Mes' : 'Día' } },
      y: { title: { display: true, text: 'Unidades vendidas' } } },
  }), [timeframe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Inteligencia de Negocios
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(totalRevenue)}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Clientes Únicos</p>
            <p className="text-2xl font-bold text-gray-900">{customerCount}</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Órdenes Entregadas</p>
            <p className="text-2xl font-bold text-gray-900">{delivered.length}</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(avgOrderValue)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
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

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6">
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

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Ventas por {timeframe === 'month' ? 'mes' : 'día'}
              </h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as 'month' | 'day')}
                className="border rounded p-1 text-sm bg-transparent dark:border-gray-700"
              >
                <option value="month">Mensual</option>
                <option value="day">Diaria</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {topProducts.map((p) => (
                <label key={p.id} className="flex items-center space-x-1 text-sm">
                  <input
                    type="checkbox"
                    className="accent-amber-600"
                    checked={visible[p.id] ?? false}
                    onChange={() =>
                      setVisible((v) => ({ ...v, [p.id]: !v[p.id] }))
                    }
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p className="text-gray-500">No hay datos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;
