import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import { useAuthStore } from './useAuthStore';
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
      const resp = await api.get<Order[]>(endpoint);
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
    const user = useAuthStore.getState().user;

    if (!user) {
      // Cliente sin sesión → guardo en localStorage
      const raw = localStorage.getItem('guest_orders');
      const guestOrders: Order[] = raw ? JSON.parse(raw) : [];

      // Calcular total
      const total = data.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const newOrder: Order = {
        id: crypto.randomUUID(),
        OrderItems: data.items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customerInfo: data.customerInfo
      } as any;

     guestOrders.unshift(newOrder);
      localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
      set({ orders: guestOrders, isLoading: false });
      return newOrder;
    }

    // Usuario autenticado → envío al backend
    try {
      const resp = await api.post<Order>(ENDPOINTS.orders, data);
      set((st) => ({
        orders: [resp.data, ...st.orders],
        isLoading: false
      }));
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
      await api.patch(`${ENDPOINTS.orders}/${id}/status`, { status });
      set((st) => ({
        orders: st.orders.map(o =>
          o.id === id ? { ...o, status } : o
        ),
        isLoading: false
      }));
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
