import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatPrice } from '../utils/formatters';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
}
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, clearCart } = useCartStore();
  const { createOrder, isLoading, error } = useOrderStore();

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = JSON.parse(localStorage.getItem('guest_info') || '{}');
    return {
      name: saved.name || '',
      phone: saved.phone || '',
      email: saved.email || '',
      address: saved.address || '',
      paymentMethod: saved.paymentMethod || '',
    };
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }
    const payload = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        priceUnit: item.price,
        subtotal: item.quantity * item.price,
      })),
      customerInfo: formData,
      paymentMethod: formData.paymentMethod,
    };

 try {
      // Para invitado, reutilizar customerId por dispositivo si existe
      const storedId = localStorage.getItem('guest_customerId');
      const reqData: any = {
        items: payload.items,
        paymentMethod: payload.paymentMethod
      };
      if (storedId) {
        reqData.customerId = Number(storedId);
      } else {
        reqData.customerInfo = payload.customerInfo;
      }

      const result = await createOrder(reqData);
      clearCart();

      // Guardar customerId en guest_customerId luego de primer pedido
      if (!storedId && result.Customer) {
        localStorage.setItem(
          'guest_customerId',
          String(result.Customer.id)
        );
      }

      navigate('/orders', { replace: true });

    } catch {
      // error manejado en store.error
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header removido para evitar duplicado; usa el global */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Información de envío
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block mb-1 text-gray-700"
                >
                  Dirección
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="paymentMethod"
                  className="block mb-1 text-gray-700"
                >
                  Método de pago
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="">Selecciona método</option>
                  <option value="credit_card">Tarjeta de crédito</option>
                  <option value="cash">Efectivo</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Resumen de Pedido
            </h3>
            <ul className="divide-y divide-gray-200 mb-4">
              {items.length > 0 ? (
                items.map(item => (
                  <li
                    key={item.id}
                    className="py-2 flex justify-between"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-2 text-gray-500">
                  El carrito está vacío.
                </li>
              )}
            </ul>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4 space-y-2">
              <p>• Free delivery for orders over $25</p>
              <p>
                • You'll receive un email confirmation once your order is confirmed
              </p>
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <Button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full"
            >
              {loading ? 'Procesando...' : 'Realizar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
