import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cake, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading } = useStore();
  
  // Estado simplificado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Redirige a inicio
    } catch {
      // El error se maneja en el store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Cake className="h-12 w-12 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Digital Bakery</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              size="lg"
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-amber-600 hover:text-amber-500 font-medium">
                Contact us to register
              </button>
            </p>
          </div>
        </div>

        {/* Credenciales demo */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Demo credentials: admin@bakery.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;