import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Layout from '../components/common/Layout';
import ProductsTable from '../components/admin/ProductsTable';
import ProductForm from '../components/admin/ProductForm';
import DashboardStats from '../components/admin/DashboardStats';
import SalesChart from '../components/admin/charts/SalesChart';
import useStore from '../store/useStore';
import { Product } from '../types';

const AdminPage: React.FC = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const dashboardStats = useStore((state) => state.dashboardStats);
  
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.description.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setShowProductForm(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };
  
  const handleSubmitProduct = (product: Product) => {
    if (selectedProduct) {
      updateProduct(product.id, product);
    } else {
      addProduct(product);
    }
    setShowProductForm(false);
  };
  
  const handleToggleProductAvailability = (productId: string, isAvailable: boolean) => {
    updateProduct(productId, { isAvailable });
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      deleteProduct(productId);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-6">Panel de Administración</h1>
          
          <DashboardStats stats={dashboardStats} />
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Análisis de Ventas</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartPeriod('daily')}
                className={`px-3 py-1 text-sm rounded-md ${
                  chartPeriod === 'daily'
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Diario
              </button>
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  chartPeriod === 'weekly'
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  chartPeriod === 'monthly'
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mensual
              </button>
            </div>
          </div>
          
          <SalesChart salesData={dashboardStats.salesData} period={chartPeriod} />
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos más vendidos</h3>
              <div className="space-y-4">
                {dashboardStats.topProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="text-gray-800 font-medium">{product.productName}</div>
                      <div className="text-sm text-gray-500">{product.totalSold} vendidos</div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-700 font-semibold">S/ {product.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Métodos de pago</h3>
              <div className="space-y-6">
                {dashboardStats.paymentStats.map((stat) => (
                  <div key={stat.method}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 capitalize">{stat.method}</span>
                      <span className="text-gray-700">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>{stat.count} pedidos</span>
                      <span>S/ {stat.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              Agregar Producto
            </button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {showProductForm ? (
            <ProductForm
              initialProduct={selectedProduct}
              onSubmit={handleSubmitProduct}
              onCancel={() => setShowProductForm(false)}
            />
          ) : (
            <ProductsTable
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleAvailability={handleToggleProductAvailability}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;