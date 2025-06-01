import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '../components/common/Layout';
import CategorySidebar from '../components/common/CategorySidebar';
import ProductsGrid from '../components/shop/ProductsGrid';
import useStore from '../store/useStore';

const ShopPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = useStore((state) => state.products);
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && product.isAvailable;
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Nuestros Productos</h1>
          <p className="text-gray-600">Descubre nuestra variedad de panes y pasteles artesanales</p>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <CategorySidebar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>
          
          <div className="flex-grow">
            <ProductsGrid
              products={filteredProducts}
              category={activeCategory}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;