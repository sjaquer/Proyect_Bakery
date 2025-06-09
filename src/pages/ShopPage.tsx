// src/pages/ShopPage.tsx
import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

const ShopPage: React.FC = () => {
  const { products, fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Nuestra Tienda</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => (
            <div key={p.id} className="border rounded p-4 shadow">
              {p.imageUrl && (
                <img src={p.imageUrl}
                     alt={p.name}
                     className="w-full h-32 object-cover mb-2" />
              )}
              <h2 className="font-semibold text-xl">{p.name}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="mt-1 font-bold">${p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
