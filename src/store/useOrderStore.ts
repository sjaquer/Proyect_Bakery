import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import {
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateStatus,
  deleteOrder as apiDeleteOrder,
} from '../api/orderService';
import { useAuthStore } from './useAuthStore';
import { useProductStore } from './useProductStore';
import type { Order, CheckoutData } from '../types/order';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: CheckoutData) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;

    if (!user) {
      // Cliente sin sesión → leo pedidos de localStorage
      const raw = localStorage.getItem('guest_orders');
      const guestOrders: Order[] = raw ? JSON.parse(raw) : [];
      set({ orders: guestOrders, isLoading: false });
      return;
    }


   // Usuario autenticado → llamo al backend
    try {
      const endpoint =
        user.role === 'admin' ? ENDPOINTS.adminOrders : ENDPOINTS.orders;
      const resp = await api.get<Order[]>(`${endpoint}?expand=customer,items`);
      set({ orders: resp.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const resp = await apiCreateOrder(data);
      set((st) => ({
        orders: [resp.data, ...st.orders],
        isLoading: false
      }));

      // Update stock locally based on ordered items
      const adjustStock = useProductStore.getState().adjustStock;
      adjustStock(data.items.map(i => ({
        productId: Number(i.productId),
        quantity: i.quantity
      })));

      // Si no hay usuario autenticado, persistir en localStorage
      const user = useAuthStore.getState().user;
      if (!user) {
        const raw = localStorage.getItem('guest_orders');
        const prev: Order[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          'guest_orders',
          JSON.stringify([resp.data, ...prev])
        );
        if (resp.data.customer && !localStorage.getItem('guest_customerId')) {
          localStorage.setItem(
            'guest_customerId',
            String(resp.data.customer.id)
          );
        }
      }

      return resp.data;
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
      await apiUpdateStatus(id, status);
      set((st) => ({
        orders: st.orders.map(o => (o.id === id ? { ...o, status } : o)),
        isLoading: false
      }));
      window.dispatchEvent(new CustomEvent('orders:updated'));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
      throw err;
    }
  },

  deleteOrder: async (id) => {
    set({ isLoading: true, error: null });
    const user = useAuthStore.getState().user;
    try {
      await apiDeleteOrder(id);
      set((st) => ({
        orders: st.orders.filter(o => o.id !== id),
        isLoading: false
      }));
      if (!user) {
        const raw = localStorage.getItem('guest_orders');
        const prev: Order[] = raw ? JSON.parse(raw) : [];
        localStorage.setItem(
          'guest_orders',
          JSON.stringify(prev.filter(o => o.id !== id))
        );
      }
      window.dispatchEvent(new CustomEvent('orders:updated'));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
      throw err;
    }
  },

  clearError: () => set({ error: null })
}));
