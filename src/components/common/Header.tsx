import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';
import useAuthStore from '../../store/useAuthStore';
import LoginModal from '../auth/LoginModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginClicks, setLoginClicks] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const cart = useStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary-700 font-medium' : 'text-gray-600 hover:text-primary-600';
  };
  
  const handleLogoClick = () => {
    setLoginClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowLoginModal(true);
        return 0;
      }
      return newCount;
    });
    
    // Reset clicks after a delay
    setTimeout(() => setLoginClicks(0), 2000);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={handleLogoClick}
          >
            <img 
              src="https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg" 
              alt="Logo" 
              className="h-10 w-10 rounded-full object-cover" 
            />
            <span className="text-2xl font-display font-bold text-primary-700">Panadería</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors duration-200`}>
              Productos
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={`${isActive('/admin')} transition-colors duration-200`}>
                Admin
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/orders" className={`${isActive('/orders')} transition-colors duration-200`}>
                Pedidos
              </Link>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-error-600"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-primary-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${isActive('/')} block py-2 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`${isActive('/admin')} block py-2 transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Link 
                  to="/orders" 
                  className={`${isActive('/orders')} block py-2 transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pedidos
                </Link>
              )}
              {user && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-error-600"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default Header;