import React from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import useStore from '../../store/useStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity } = item;
  const updateCartItemQuantity = useStore((state) => state.updateCartItemQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  
  const handleIncrement = () => {
    if (quantity < product.stock) {
      updateCartItemQuantity(product.id, quantity + 1);
    }
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateCartItemQuantity(product.id, quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(product.id);
  };
  
  return (
    <div className="flex border-b pb-4 mb-4 animate-fade-in">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-gray-800 font-medium">{product.name}</h3>
          <button onClick={handleRemove} className="text-gray-400 hover:text-error-500">
            <Trash size={18} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              disabled={quantity >= product.stock}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-primary-700 font-semibold">
              S/ {(product.price * quantity).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              S/ {product.price.toFixed(2)} cada uno
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;