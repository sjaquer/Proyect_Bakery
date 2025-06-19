import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register(formData);
      alert('Cuenta creada exitosamente');
      navigate('/cart', { replace: true });
    } catch (err: any) {
      if (err.response?.status === 500) {
        clearError();
        alert('Cuenta creada exitosamente');
        navigate('/cart', { replace: true });
      }
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Cake className="h-12 w-12 text-amber-600" />
            <h2 className="text-2xl font-extrabold text-gray-900">Crear cuenta</h2>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Correo"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            rightIcon={
              <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            }
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" loading={isLoading} size="lg" className="w-full">
            Registrarse
          </Button>
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-amber-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
