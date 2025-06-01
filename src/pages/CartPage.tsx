import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertTriangle, ArrowLeft } from 'lucide-react';
import Layout from '../components/common/Layout';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import useStore from '../store/useStore';

const CartPage: React.FC = () => {
  const [showEmptyCartAlert, setShowEmptyCartAlert] = useState(false);
  const navigate = useNavigate();
  
  const cart = useStore((state) => state.cart);
  
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      setShowEmptyCartAlert(true);
      setTimeout(() => setShowEmptyCartAlert(false), 3000);
      return;
    }
    navigate('/checkout');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-primary-600" />
            Mi Carrito
          </h1>
          <p className="text-gray-600">Revisa tus productos seleccionados</p>
        </div>
        
        {showEmptyCartAlert && (
          <div className="bg-warning-100 border-l-4 border-warning-500 text-warning-700 p-4 mb-6 rounded-md animate-fade-in">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <p>Tu carrito está vacío. Agrega productos antes de continuar.</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            {cart.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Productos ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
                
                <div className="space-y-2">
                  {cart.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/')}
                    className="text-primary-600 hover:text-primary-800 flex items-center text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continuar comprando
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center justify-center py-10">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
                  <p className="text-gray-600 mb-6">Agrega productos a tu carrito para continuar</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-800 transition-colors"
                  >
                    Ver productos
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-1/3">
            <CartSummary onProceedToCheckout={handleProceedToCheckout} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;