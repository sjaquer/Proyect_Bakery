// src/pages/CheckoutPage.tsx
import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart, user, token } = useStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: user.id,
          items: cartItems.map(ci => ({
            productId: ci.productId,
            quantity: ci.quantity
          }))
        })
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Error en checkout:', err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cartItems.map(ci => (
        <div key={ci.productId}>{ci.name} x {ci.quantity}</div>
      ))}
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleCheckout}
      >
        Finalizar Pedido
      </button>
    </div>
  );
};

export default CheckoutPage;
