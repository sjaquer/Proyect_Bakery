// src/store/useOrderStore.ts

import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import type { Order, CheckoutData } from '../types/order';
import type { User } from '../types/auth';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: CheckoutData) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Leer usuario de localStorage
      const stored = localStorage.getItem('auth-storage');
      const auth = stored ? JSON.parse(stored) as { user: User } : null;
      
      let response;
      if (auth?.user.role === 'admin') {
        // Admin: todas las órdenes
        response = await api.get<Order[]>(ENDPOINTS.adminOrders);
      } else {
        // Cliente: solo sus órdenes
        response = await api.get<Order[]>(ENDPOINTS.customerOrders(auth?.user.id.toString() || ''));
      }

      set({ orders: response.data, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Crear la orden en el backend
      const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}') as { user: User };
      const payload = {
        customerId: auth.user.id,
        items: data.items,
      };
      const response = await api.post<Order>(ENDPOINTS.orders, payload);
      // Refrescar lista si es cliente
      await (auth.user.role === 'customer' && set(() => { /** nop */ }));
      set(state => ({ orders: [response.data, ...state.orders], isLoading: false }));
      return response.data;
    } catch (err: any) {
      console.error('Error creating order:', err);
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<Order>(`${ENDPOINTS.orders}/${id}/status`, { status });
      set(state => ({
        orders: state.orders.map(o => (o.id === response.data.id ? response.data : o)),
        isLoading: false
      }));
    } catch (err: any) {
      console.error('Error updating order status:', err);
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
