// src/components/common/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: 'admin' | 'customer';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const user = useStore(state => state.user);
  const token = useStore(state => state.token);

  if (!token || !user) {
    // Si no hay token o user, redirige a login
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    // Si el usuario no tiene el rol requerido, redirige a home
    return <Navigate to="/" replace />;
  }
  // Si pasó las validaciones, renderiza el contenido
  return children;
};

export default PrivateRoute;
