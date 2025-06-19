import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cake, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation<LocationState>();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // **IMPORTANTE**: definimos always un “from” por defecto
  const from = location.state?.from?.pathname || '/orders';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(formData);
      alert('Inicio de sesión exitoso');
      // Ahora sí navega al /admin (o la ruta que venías)
      navigate(from, { replace: true });
    } catch {
      // el store ya pone error en pantalla
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div>
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Cake className="h-12 w-12 text-amber-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">Digital Bakery</h2>
          </Link>
          <p className="text-center text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Correo"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            loading={isLoading}
            size="lg"
            className="w-full"
          >
            Entrar
          </Button>
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-amber-600 hover:underline">
              Crea una aquí
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Login;
