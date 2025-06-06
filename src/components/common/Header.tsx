// src/components/common/Header.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import LoginModal from '../auth/LoginModal';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);

  const rawCartItems = useStore(state => state.cartItems);
  const cartItems = Array.isArray(rawCartItems) ? rawCartItems : [];
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Mi Bakery</Link>

      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:underline">Tienda</Link>

        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="hover:underline">Dashboard</Link>
            <Link to="/admin/products" className="hover:underline">Gestionar Productos</Link>
          </>
        )}

        {user?.role === 'customer' && (
          <Link to="/orders" className="hover:underline">Mis Pedidos</Link>
        )}

        {user ? (
          <>
            <span>Hola, {user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="hover:underline"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center space-x-1 hover:underline"
          >
            <User size={18} />
            <span>Ingresar</span>
          </button>
        )}

        <Link to="/cart" className="relative hover:underline">
          <ShoppingCart size={18} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 rounded-full px-1 text-xs">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default Header;
