// src/api/endpoints.ts
export const ENDPOINTS = {
  // Auth
  login:    '/auth/login',
  register: '/auth/register',

  // Perfil de usuario
  userProfile: '/users/profile',

  // Productos
  products:    '/products',
  productById: (id: string) => `/products/${id}`,

  // Órdenes (cliente)
  orders: '/orders',
  userOrders: (userId: string) => `/orders?userId=${userId}`,
  orderStatus: (id: string) => `/orders/${id}/status`,

  // Órdenes (admin)
  adminOrders:     '/orders/all',
  
  // Gestión de productos (admin)
  adminProducts:   '/products',
} as const;
