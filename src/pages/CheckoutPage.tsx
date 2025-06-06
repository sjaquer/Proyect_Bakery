// src/pages/CheckoutPage.tsx

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CheckoutPage: React.FC = () => {
  const cartItems = useStore(state => state.cartItems);
  const getCartTotal = useStore(state => state.getCartTotal);
  const clearCart = useStore(state => state.clearCart);
  const fetchCustomerOrders = useStore(state => state.fetchCustomerOrders);
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [isDelivery, setIsDelivery] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p>Tu carrito está vacío. Añade productos antes de pagar.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !phone || (isDelivery && !address)) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Construir payload
    const payload = {
      customer: { name, phone, email, address },
      items: cartItems.map(ci => ({
        productId: ci.productId,
        quantity: ci.quantity,
      })),
      isDelivery,
    };

    try {
      // Hacer POST /orders
      const resp = await api.post('/orders', payload);
      const newOrder = resp.data;
      setOrderId(newOrder.id);
      setOrderPlaced(true);
      clearCart();

      // Si el usuario está logueado como cliente, recargar sus órdenes
      if (user) {
        fetchCustomerOrders(user.id);
      }
    } catch (err: any) {
      console.error('Error al crear la orden:', err.response || err);
      setError('Hubo un error al procesar el pedido. Intenta de nuevo.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">¡Pedido Recibido!</h2>
        <p>Tu número de pedido es: <strong>{orderId}</strong></p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre*</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Teléfono*</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-medium">¿Envío o recojo?</label>
          <select
            value={isDelivery ? 'delivery' : 'pickup'}
            onChange={e => setIsDelivery(e.target.value === 'delivery')}
            className="border p-2 rounded w-full"
          >
            <option value="delivery">Envío</option>
            <option value="pickup">Recojo en tienda</option>
          </select>
        </div>
        {isDelivery && (
          <div>
            <label className="block font-medium">Dirección*</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="border p-2 rounded w-full"
              required={isDelivery}
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirmar Pedido (${getCartTotal().toFixed(2)})
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
