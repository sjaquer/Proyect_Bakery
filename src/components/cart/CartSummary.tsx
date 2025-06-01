import React from 'react';
import { ShoppingBag } from 'lucide-react';
import useStore from '../../store/useStore';

interface CartSummaryProps {
  onProceedToCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onProceedToCheckout }) => {
  const cart = useStore((state) => state.cart);
  const calculateCartTotal = useStore((state) => state.calculateCartTotal);
  
  const cartTotal = calculateCartTotal();
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-20">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen del pedido</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>S/ {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Impuestos</span>
          <span>Incluidos</span>
        </div>
        {/* You can add delivery fees or discounts here if needed */}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between font-semibold text-lg mb-6">
          <span>Total</span>
          <span className="text-primary-700">S/ {cartTotal.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onProceedToCheckout}
          disabled={cart.length === 0}
          className={`w-full py-3 rounded-md flex items-center justify-center ${
            cart.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-700 text-white hover:bg-primary-800 transition-colors'
          }`}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          Proceder al pago {itemCount > 0 && `(${itemCount})`}
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          Su pedido está sujeto a nuestra política de pedidos. Consulta nuestros 
          <a href="#" className="text-primary-600 hover:underline"> términos y condiciones</a>.
        </p>
      </div>
    </div>
  );
};

export default CartSummary;