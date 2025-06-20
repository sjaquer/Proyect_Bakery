import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import Input from '../components/shared/Input';
import CategorySidebar from '../components/Product/CategorySidebar';
import ProductsGrid from '../components/Product/ProductsGrid';

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
      <div className="min-h-screen bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error al cargar productos: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestra panadería</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de panes, pasteles y postres recién horneados con los mejores ingredientes.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <CategorySidebar
              categories={categories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="flex-grow">
            <ProductsGrid products={filteredProducts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;