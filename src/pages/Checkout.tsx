import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatPrice } from '../utils/formatters';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card' as 'cash' | 'card',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      await createOrder(formData);
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`
                    w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                    ${errors.address ? 'border-red-300' : 'border-gray-300'}
                  `}
                  required
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash on Delivery</option>
                </select>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                size="lg"
                className="w-full"
              >
                Place Order ({formatPrice(total)})
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
              <p className="text-sm text-gray-600">
                • Orders are typically ready within 2-4 hours
              </p>
              <p className="text-sm text-gray-600">
                • Free delivery for orders over $25
              </p>
              <p className="text-sm text-gray-600">
                • You'll receive an email confirmation once your order is confirmed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;