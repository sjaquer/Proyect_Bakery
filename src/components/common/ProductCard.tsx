import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import useStore from '../../store/useStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useStore((state) => state.addToCart);
  
  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 animate-fade-in">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm my-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-primary-700 font-bold">S/ {product.price.toFixed(2)}</span>
          <div className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </div>
        </div>
        
        {product.stock > 0 ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={handleDecrement}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-700 text-white py-2 rounded-md hover:bg-primary-800 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 rounded-md mt-4 cursor-not-allowed"
          >
            Agotado
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;