// src/pages/ShopPage.tsx

import React, { useEffect } from 'react';
import { useStore, Product } from '../store/useStore';

const ShopPage: React.FC = () => {
  // Normalizar a array
  const rawProducts = useStore(state => state.products);
  const products: Product[] = Array.isArray(rawProducts) ? rawProducts : [];

  const fetchProducts = useStore(state => state.fetchProducts);

 useEffect(() => {
  console.log('🛒 ShopPage montado, llamando fetchProducts()');
  fetchProducts().then(() => {
    const estado = useStore.getState();
    console.log('📦 Productos cargados:', estado.products);
  });
}, [fetchProducts]);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestra Tienda</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products
            .filter(p => p.stock > 0)
            .map(p => (
              <div key={p.id} className="border p-4 rounded shadow">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-40 object-cover mb-2"
                  />
                )}
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-gray-500">{p.description}</p>
                <p className="mt-2 font-bold">${p.price}</p>
                <button
                  onClick={() =>
                    useStore.getState().addToCart({
                      productId: p.id,
                      name: p.name,
                      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
                      quantity: 1,
                    })
                  }
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Añadir al Carrito
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
