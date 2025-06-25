import React, { useEffect, useMemo, useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/Product/ProductCard';
import Input from '../components/shared/Input';

const Shop: React.FC = () => {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const productCategory = product.category?.toLowerCase() || '';
    const matchesCategory =
      selectedCategory === 'all' || productCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  const categories = useMemo(() => {
    const labelMap: Record<string, string> = {
      bread: 'Pan',
      pastry: 'Pasteles',
      cake: 'Tortas',
      cookie: 'Galletas',
      dessert: 'Postres',
      sweet: 'Dulces',
      special: 'Especial',
      general: 'General',
    };

    const unique = Array.from(
      new Set(
        products
          .map(p => p.category?.toLowerCase())
          .filter((c): c is string => Boolean(c))
      )
    );

    return [
      { value: 'all', label: 'Todos' },
      ...unique.map(c => ({
        value: c,
        label: labelMap[c] || c.charAt(0).toUpperCase() + c.slice(1),
      })),
    ];
  }, [products]);

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error al cargar productos: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestra panadería</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de panes, pasteles y postres recién horneados con los mejores ingredientes.
          </p>
        </div>

        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Destacados del día</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {featuredProducts.map(prod => (
                <div key={prod.id} className="w-64 sm:w-72 lg:w-80">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="mb-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-64 order-1 lg:order-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Menu className="h-5 w-5" /> Categorías
            </h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.value}>
                  <button
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Shop;