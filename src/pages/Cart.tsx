import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatters';
import placeholderImg from '../utils/placeholder';
import Button from '../components/shared/Button';

const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              Aún no has añadido ningún delicioso producto a tu carrito.
            </p>
            <Link to="/shop">
              <Button size="lg">Ir a la tienda</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrito de compras</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          >
            Vaciar carrito
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center"
              >
                <img
                  src={item.imageUrl || placeholderImg}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = placeholderImg;
                  }}
                />
                
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <span className="text-lg font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="text-right col-span-2 sm:col-auto">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors justify-self-end"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
            <div className="flex items-center justify-between text-xl font-semibold text-gray-900">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Seguir comprando
            </Button>
          </Link>
          <Link to="/checkout">
            <Button size="lg" className="w-full sm:w-auto">
              Ir a pagar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;