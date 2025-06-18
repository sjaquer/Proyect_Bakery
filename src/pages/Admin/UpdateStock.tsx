import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import placeholderImg from '../../utils/placeholder';

const UpdateStock: React.FC = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, updateProduct, isLoading, error } = useProductStore();

  const [stocks, setStocks] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (id: string, value: string) => {
    const num = Math.max(0, Number(value));
    setStocks(prev => ({ ...prev, [id]: num }));
  };

  const handleSave = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStock = stocks[id];
    if (newStock === undefined || newStock === product.stock) return;
    try {
      await updateProduct(id, { ...product, stock: newStock });
    } catch {
      // error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Actualizar Stock</h1>
          <Button variant="outline" onClick={() => navigate('/admin/products')}>Volver</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nuevo Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.imageUrl || placeholderImg}
                            alt={product.name}
                            onError={e => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = placeholderImg;
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          min={0}
                          value={stocks[product.id] ?? product.stock}
                          onChange={e => handleChange(product.id, e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button onClick={() => handleSave(product.id)} className="px-3 py-1">
                          Guardar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No hay productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStock;
