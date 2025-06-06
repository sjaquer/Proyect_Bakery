// src/pages/CartPage.tsx

import React from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const cartItems = useStore(state => state.cartItems);
  const updateCartItemQuantity = useStore(state => state.updateCartItemQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const clearCart = useStore(state => state.clearCart);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="text-blue-500">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>
      {cartItems.map(item => (
        <div key={item.productId} className="flex justify-between items-center mb-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p>${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                updateCartItemQuantity(item.productId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                updateCartItemQuantity(item.productId, item.quantity + 1)
              }
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4 font-bold">
        Total: ${getCartTotal().toFixed(2)}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={clearCart}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Vaciar Carrito
        </button>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};

export default CartPage;
