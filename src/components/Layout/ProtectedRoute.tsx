// src/components/Layout/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

type Props = {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
};

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user } = useAuthStore();

  if (!user) {
    // No estás logueado
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // No tienes el rol requerido
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
