import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { formatPrice } from '../utils/formatters';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import yapeQr from '../assets/yape-qr.png';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: 'yape' | 'cash' | '';
  cashAmount?: string;
  isDelivery: boolean;
}
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { createOrder, error, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      try {
        if (!profile) {
          await fetchProfile();
        }
        const info = useProfileStore.getState().profile;
        if (info) {
          setFormData(prev => ({
            ...prev,
            name: info.name || '',
            phone: info.phone || '',
            email: info.email || '',
            address: info.address || '',
          }));
        }
      } catch {
        // ignore profile errors
      }
    };
    load();
  }, [user, navigate, profile, fetchProfile]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: '',
    cashAmount: '',
    isDelivery: true,
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isDelivery' ? value === 'delivery' : value,
      ...(name === 'paymentMethod' && value !== 'cash' ? { cashAmount: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,}$/;
    if (!emailRegex.test(formData.email)) {
      alert('Correo inválido');
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert('Teléfono inválido');
      return;
    }
    const payload: any = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      paymentMethod: formData.paymentMethod,
      ...(formData.paymentMethod === 'cash'
        ? { cashAmount: Number(formData.cashAmount || 0) }
        : {}),
      isDelivery: formData.isDelivery,
      // Enviar la información de contacto tanto de manera anidada
      // como en la raíz para maximizar compatibilidad con la API
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };
    payload.customerInfo = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      Name: formData.name,
      Email: formData.email,
      Phone: formData.phone,
      Address: formData.address,
    };

 try {
      const result = await createOrder(payload);

      clearCart();

      navigate('/orders', { state: { newOrder: result }, replace: true });

    } catch {
      // error manejado en store.error
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header removido para evitar duplicado; usa el global */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Finalizar compra</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Información de envío
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <p className="text-gray-700">
                  Los datos de nombre, teléfono y dirección se completarán automáticamente con la información de tu cuenta.
                </p>
                <Link to="/profile">
                  <Button type="button" variant="outline">
                    Cambiar datos desde mi perfil
                  </Button>
                </Link>
              </div>
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
                {formData.paymentMethod === 'yape' && (
                  <div className="flex flex-col items-center">
                    <img
                      src={yapeQr}
                      alt="QR Yape"
                      className="w-40 h-40 object-cover mx-auto"
                    />
                    <p className="text-center text-sm text-gray-700 mt-2">
                      Realiza tu pago al{' '}
                      <span className="font-semibold">928527185</span> y envía la
                      constancia a este mismo número.
                    </p>
                  </div>
                )}
                <div>
                  <label htmlFor="isDelivery" className="block mb-1 text-gray-700">
                    Entrega
                  </label>
                  <select
                    id="isDelivery"
                    name="isDelivery"
                    value={formData.isDelivery ? 'delivery' : 'pickup'}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Recoger en tienda</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
            <div className="text-sm text-gray-600 mb-4">
              <p>
                Se te enviará un mensaje en whatsapp cuando tu pedido esté saliendo
                a tu domicilio o, si es para recoger, cuando esté listo para
                recoger. También servirá para responder preguntas.
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
