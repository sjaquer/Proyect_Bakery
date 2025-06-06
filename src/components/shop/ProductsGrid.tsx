import React from 'react';
import { useStore } from '../../store/useStore'; // Corregida la importación
import ProductCard from '../common/ProductCard';
import { Product } from '../../types';

interface ProductsGridProps {
  products: Product[];
  category: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, category }) => {
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;