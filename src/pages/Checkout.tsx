import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'yape' | 'cash' | '';
  cashAmount?: string;
}
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, clearCart } = useCartStore();
  const { createOrder, error, isLoading } = useOrderStore();

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = JSON.parse(localStorage.getItem('guest_info') || '{}');
    return {
      name: saved.name || '',
      phone: saved.phone || '',
      email: saved.email || '',
      address: saved.address || '',
      paymentMethod: (saved.paymentMethod as 'yape' | 'cash') || '',
      cashAmount: saved.cashAmount || '',
    };
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'paymentMethod' && value !== 'cash' ? { cashAmount: '' } : {})
    }));
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
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      },
      paymentMethod: formData.paymentMethod,
      total,
      ...(formData.paymentMethod === 'cash'
        ? { cashAmount: Number(formData.cashAmount || 0) }
        : {}),
    };

 try {
      // Para invitado, reutilizar customerId por dispositivo si existe
      const storedId = localStorage.getItem('guest_customerId');
      const reqData: any = {
        items: payload.items,
        paymentMethod: payload.paymentMethod,
        total: payload.total,
      };
      if (formData.paymentMethod === 'cash') {
        reqData.cashAmount = payload.cashAmount;
      }
      if (storedId) {
        reqData.customerId = Number(storedId);
      } else {
        reqData.customerInfo = payload.customerInfo;
      }

      const result = await createOrder(reqData);

      // Guardar info del formulario para siguientes compras
      localStorage.setItem('guest_info', JSON.stringify(formData));

      // Si el usuario es invitado, persistir su lista de pedidos
      if (!user) {
        const raw = localStorage.getItem('guest_orders');
        const prev = raw ? JSON.parse(raw) : [];
        localStorage.setItem('guest_orders', JSON.stringify([result, ...prev]));
      }

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
        <h2 className="text-3xl font-bold mb-6">Finalizar compra</h2>
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
              <div className="md:col-span-2 space-y-4">
                <div>
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
                    <option value="yape">Yape</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>
                {formData.paymentMethod === 'cash' && (
                  <Input
                    label="¿Con cuánto paga?"
                    name="cashAmount"
                    type="number"
                    value={formData.cashAmount}
                    onChange={handleChange}
                    required
                  />
                )}
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
              <p>• Envío gratis para pedidos superiores a $25</p>
              <p>
                • Recibirás un correo de confirmación cuando tu pedido sea procesado
              </p>
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading || items.length === 0}
              className="w-full"
            >
              {isLoading ? 'Procesando...' : 'Realizar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
