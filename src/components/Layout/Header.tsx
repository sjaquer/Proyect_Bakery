import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Cake, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import Button from '../shared/Button';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Cake className="h-8 w-8 text-amber-600" />
            <span className="text-xl font-bold text-gray-900">Digital Bakery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
              }
            >
              Tienda
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
              }
            >
              Mis pedidos
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                end={false}
                className={({ isActive }) =>
                  isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
                }
              >
                Administración
              </NavLink>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              <ShoppingCart id="cart-icon" className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="text-sm text-gray-700 hover:text-amber-600">
                  Hola, {user.name}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
            >
              <ShoppingCart id="cart-icon-mobile" className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-amber-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tienda
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mis pedidos
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  end={false}
                  className={({ isActive }) =>
                    isActive ? 'text-amber-600' : 'text-gray-700 hover:text-amber-600 transition-colors duration-200'
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Administración
                </NavLink>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart id="cart-icon-menu" className="h-5 w-5" />
                  <span>Carrito ({cartCount})</span>
                </Link>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="text-sm text-gray-700 hover:text-amber-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Salir</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Iniciar Sesión</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
