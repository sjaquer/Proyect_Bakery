import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import Layout from '../components/common/Layout';
import CheckoutForm from '../components/checkout/CheckoutForm';
import useStore from '../store/useStore';

const CheckoutPage: React.FC = () => {
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [orderDetails, setOrderDetails] = React.useState<{ id: string; total: number } | null>(null);
  
  const navigate = useNavigate();
  
  const cart = useStore((state) => state.cart);
  const addOrder = useStore((state) => state.addOrder);
  const createNewOrder = useStore((state) => state.createNewOrder);
  const clearCart = useStore((state) => state.clearCart);
  
  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cart, navigate, orderPlaced]);
  
  const handlePlaceOrder = () => {
    const newOrder = createNewOrder();
    
    if (newOrder) {
      addOrder(newOrder);
      setOrderDetails({
        id: newOrder.id,
        total: newOrder.totalAmount,
      });
      setOrderPlaced(true);
      clearCart();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {orderPlaced ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-success-100 p-3 mb-4">
                  <CheckCircle className="h-16 w-16 text-success-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">¡Pedido realizado con éxito!</h2>
                <p className="text-gray-600 mb-6">
                  Gracias por tu compra. Tu pedido #{orderDetails?.id} ha sido recibido.
                </p>
                <p className="text-lg font-medium text-primary-700 mb-8">
                  Total: S/ {orderDetails?.total.toFixed(2)}
                </p>
                
                <div className="space-y-4 w-full max-w-sm">
                  <p className="text-gray-600 text-sm">
                    Recibirás una confirmación por WhatsApp cuando tu pedido sea aceptado.
                  </p>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-800 transition-colors flex items-center justify-center"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continuar comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Finalizar Compra</h1>
              <p className="text-gray-600">Complete sus datos para procesar el pedido</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-3/4">
                <CheckoutForm onPlaceOrder={handlePlaceOrder} />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutPage;