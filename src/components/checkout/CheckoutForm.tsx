import React from 'react';
import { MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore'; // Corregida la importación

interface CheckoutFormProps {
  onPlaceOrder: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPlaceOrder }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const {
    customerName,
    customerWhatsapp,
    customerAddress,
    isDelivery,
    paymentMethod,
    cashAmount,
    setCustomerName,
    setCustomerWhatsapp,
    setCustomerAddress,
    setIsDelivery,
    setPaymentMethod,
    setCashAmount,
    calculateCartTotal,
  } = useStore();
  
  const cartTotal = calculateCartTotal();
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!customerWhatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es requerido';
    } else if (!/^\+?\d{9,15}$/.test(customerWhatsapp.trim())) {
      newErrors.whatsapp = 'Ingrese un número de WhatsApp válido';
    }
    
    if (isDelivery && !customerAddress.trim()) {
      newErrors.address = 'La dirección es requerida para delivery';
    }
    
    if (paymentMethod === 'cash') {
      if (!cashAmount) {
        newErrors.cashAmount = 'Ingrese el monto con el que pagará';
      } else if (cashAmount < cartTotal) {
        newErrors.cashAmount = 'El monto debe ser mayor o igual al total';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPlaceOrder();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del cliente</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full p-3 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="Nombre y apellido"
            />
            {errors.name && (
              <p className="text-error-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              Número de WhatsApp *
            </label>
            <input
              type="text"
              id="whatsapp"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              className={`w-full p-3 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                errors.whatsapp ? 'border-error-500' : 'border-gray-300'
              }`}
              placeholder="+51 999 999 999"
            />
            {errors.whatsapp && (
              <p className="text-error-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.whatsapp}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Delivery Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Opciones de entrega</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="pickup"
                name="deliveryOption"
                checked={!isDelivery}
                onChange={() => setIsDelivery(false)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="pickup" className="ml-2 text-gray-700">
                Recoger en tienda
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="delivery"
                name="deliveryOption"
                checked={isDelivery}
                onChange={() => setIsDelivery(true)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="delivery" className="ml-2 text-gray-700">
                Delivery
              </label>
            </div>
          </div>
          
          {isDelivery && (
            <div className="mt-4 animate-slide-in">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de entrega *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className={`w-full p-3 pl-10 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.address ? 'border-error-500' : 'border-gray-300'
                  }`}
                  placeholder="Av. Arequipa 123, Lima"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
              </div>
              {errors.address && (
                <p className="text-error-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address}
                </p>
              )}
              
              <p className="text-sm text-gray-500 mt-2">
                <span className="text-warning-600 font-medium">Nota:</span> El 
                delivery tiene un radio limitado. Verificaremos la disponibilidad 
                para su dirección.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Método de pago</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                paymentMethod === 'cash' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="cash" className="ml-2 font-medium text-gray-700">
                  Efectivo
                </label>
              </div>
            </div>
            
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                paymentMethod === 'yape' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('yape')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yape"
                  name="paymentMethod"
                  checked={paymentMethod === 'yape'}
                  onChange={() => setPaymentMethod('yape')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="yape" className="ml-2 font-medium text-gray-700">
                  Yape
                </label>
              </div>
            </div>
            
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                paymentMethod === 'plin' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('plin')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id="plin"
                  name="paymentMethod"
                  checked={paymentMethod === 'plin'}
                  onChange={() => setPaymentMethod('plin')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="plin" className="ml-2 font-medium text-gray-700">
                  Plin
                </label>
              </div>
            </div>
          </div>
          
          {paymentMethod === 'cash' && (
            <div className="mt-4 animate-slide-in">
              <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-1">
                ¿Con cuánto va a pagar? *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-500">S/</span>
                <input
                  type="number"
                  id="cashAmount"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                  min={cartTotal}
                  step="0.10"
                  className={`w-full p-3 pl-8 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                    errors.cashAmount ? 'border-error-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.cashAmount && (
                <p className="text-error-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cashAmount}
                </p>
              )}
              
              {cashAmount > cartTotal && (
                <p className="text-sm text-gray-600 mt-2">
                  Su cambio será: <span className="font-medium">S/ {(cashAmount - cartTotal).toFixed(2)}</span>
                </p>
              )}
            </div>
          )}
          
          {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 animate-slide-in">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-primary-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-gray-700 font-medium">
                    Información de pago {paymentMethod === 'yape' ? 'Yape' : 'Plin'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Número: +51 987 654 321<br />
                    A nombre de: Panadería Artesanal<br />
                    <span className="text-warning-600 font-medium">Importante:</span> Realice 
                    el pago una vez que confirmemos su pedido.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Summary & Submit */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen y confirmación</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>S/ {cartTotal.toFixed(2)}</span>
          </div>
          {isDelivery && (
            <div className="flex justify-between text-gray-600">
              <span>Costo de delivery</span>
              <span>Incluido</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Impuestos</span>
            <span>Incluidos</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary-700">S/ {cartTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-primary-700 text-white font-medium rounded-md hover:bg-primary-800 transition-colors"
        >
          Confirmar pedido
        </button>
        
        <p className="text-sm text-center text-gray-500 mt-4">
          Al confirmar, acepta nuestros <a href="#" className="text-primary-600 hover:underline">términos y condiciones</a>.
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;