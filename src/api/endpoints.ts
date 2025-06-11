// src/api/endpoints.ts
export const ENDPOINTS = {
  // Auth
  login:    '/auth/login',
  register: '/auth/register',

  // Productos
  products:    '/products',
  productById: (id: string) => `/products/${id}`,

  // Órdenes (cliente)
  orders:           '/orders',
  customerOrders:   (clientId: string) => `/orders?clientId=${clientId}`,

  // Órdenes (admin)
  adminOrders:     '/orders/all',
  
  // Gestión de productos (admin)
  adminProducts:   '/products',
} as const;
