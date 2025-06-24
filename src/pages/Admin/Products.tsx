import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { Product, ProductFormData } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';
import ProductForm from '../../components/Product/ProductForm';
import StockUpdateForm from '../../components/Product/StockUpdateForm';
import placeholderImg from '../../utils/placeholder';

const Products: React.FC = () => {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    isLoading,
    error,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data);
      setShowForm(false);
    } catch {
      // Error is handled by the store
    }
  };

   const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      setShowForm(false);
    } catch {
      // el store maneja error
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
      } catch {
        // el store maneja error
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleBulkStockUpdate = async (
    updates: { id: string; stock: number }[]
  ) => {
    try {
      for (const u of updates) {
        const product = products.find(p => p.id === u.id);
        if (!product) continue;
        const data: ProductFormData = {
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
          stock: u.stock,
          ingredients: product.ingredients,
          allergens: product.allergens,
        };
        await updateProduct(product.id, data);
      }
      setShowStockForm(false);
    } catch {
      // error handled by store
    }
  };

  if (showStockForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Actualizar Stock</h1>
            <Button variant="outline" onClick={() => setShowStockForm(false)}>
              Cancelar
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <StockUpdateForm
              products={products}
              onSubmit={handleBulkStockUpdate}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </h1>
            <Button variant="outline" onClick={handleCloseForm}>
              Cancelar
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProductForm
              initialData={editingProduct || undefined}
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              submitLabel={editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Producto</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowStockForm(true)}
            >
              Actualizar Stock
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products List for mobile */}
        <div className="space-y-4 md:hidden">
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-4 space-y-2"
              >
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded object-cover"
                    src={product.imageUrl || placeholderImg}
                    alt={DOMPurify.sanitize(product.name)}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = placeholderImg;
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <p
                      className="font-medium text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.name),
                      }}
                    />
                    <p
                      className="text-sm text-gray-500 line-clamp-1"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.description),
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-amber-600 hover:text-amber-900 p-1 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleFeatured(product.id, !product.featured)}
                    className={product.featured ? 'text-amber-500' : 'text-gray-300'}
                    aria-label="Marcar destacado"
                  >
                    <Star className={`h-4 w-4${product.featured ? ' fill-amber-400' : ''}`} />
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                    {product.category}
                  </span>
                  <span>{formatPrice(product.price)}</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No se encontraron productos
            </p>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destacado
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
                            <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.imageUrl || placeholderImg}
                            alt={DOMPurify.sanitize(product.name)}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = placeholderImg;
                            }}
                          />
                          <div className="ml-4">
                            <div
                              className="text-sm font-medium text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product.name),
                              }}
                            />
                            <div
                              className="text-sm text-gray-500 line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product.description),
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleFeatured(product.id, !product.featured)}
                          className={product.featured ? 'text-amber-500' : 'text-gray-300'}
                          aria-label="Marcar destacado"
                        >
                          <Star className={`h-5 w-5${product.featured ? ' fill-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-amber-600 hover:text-amber-900 p-1 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron productos
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

export default Products;