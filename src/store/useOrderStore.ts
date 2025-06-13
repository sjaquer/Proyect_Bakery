// src/store/useOrderStore.ts
import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import { useAuthStore } from './useAuthStore';  // ▶▶▶ Importa tu store de auth

import type { Order, CheckoutData } from '../types/order';

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
      // ▶▶▶ Toma el user del store, no de localStorage
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('No está logueado');
    // ▶▶▶ Usa el endpoint correcto según tu ENDPOINTS
      const endpoint =
        user.role === 'admin' ? ENDPOINTS.adminOrders : ENDPOINTS.orders;
      const response = await api.get<Order[]>(endpoint);

      set({ orders: response.data, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // ▶▶▶ Usa siempre ENDPOINTS.orders para crear
      const response = await api.post<Order>(ENDPOINTS.orders, data);
      set((state) => ({
        orders: [response.data, ...state.orders],
        isLoading: false
      }));
      return response.data;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
      throw err;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      // ▶▶▶ Si tu backend expone PATCH /orders/:id/status, ajústalo:
      await api.patch(`${ENDPOINTS.orders}/${id}/status`, { status });
      set((state) => {
        const orders = state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        );
        return { orders, isLoading: false };
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));