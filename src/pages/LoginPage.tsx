// src/pages/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const login = useStore(state => state.login);
  const user = useStore(state => state.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas.');
    }
  };

  // Si user ya está logueado, redirige automáticamente
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/orders');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-4 max-w-sm">
      <h2 className="text-2xl font-semibold mb-4">Iniciar Sesión</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
