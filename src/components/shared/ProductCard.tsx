// =========================================
// src/components/shared/ProductCard.tsx
// =========================================

import React from 'react';
import Button from './Button';
import { formatPrice } from '../../utils/formatters';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isInStock = product.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full object-cover rounded mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 flex-1">{product.description}</p>
      <p className="mt-2 font-bold">{formatPrice(product.price)}</p>
      <p className={`mt-1 ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
        {isInStock ? `En stock: ${product.stock}` : 'Fuera de stock'}
      </p>
      <Button
        onClick={() => onAddToCart(product.id)}
        disabled={!isInStock}
        className="mt-4"
      >
        Añadir al carrito
      </Button>
    </div>
  );
};

export default ProductCard;