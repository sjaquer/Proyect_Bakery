// src/pages/ShopPage.tsx

import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

const ShopPage: React.FC = () => {
  const products = useStore(state => state.products);
  const fetchProducts = useStore(state => state.fetchProducts);
  const addToCart = useStore(state => state.addToCart);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtrado por categoría y búsqueda
  const filtered = products.filter(prod => {
    const matchCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price,
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between">
        <select
          value={activeCategory}
          onChange={e => setActiveCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Todos</option>
          <option value="bread">Bread</option>
          <option value="sweet">Sweet</option>
          <option value="special">Special</option>
        </select>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-1/3"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(prod => (
          <div key={prod.id} className="border rounded p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{prod.name}</h3>
            <p className="text-gray-600">{prod.description}</p>
            <p className="mt-2 font-bold">${prod.price}</p>
            <button
              onClick={() => handleAddToCart(prod)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={prod.stock === 0}
            >
              {prod.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
