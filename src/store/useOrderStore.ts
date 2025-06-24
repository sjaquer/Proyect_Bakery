import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import {
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateStatus,
  deleteOrder as apiDeleteOrder,
  getOrderById,
  getOrdersByUser,
} from '../api/orderService';
import { useAuthStore } from './useAuthStore';
import { useProductStore } from './useProductStore';
import type { Order, CheckoutData } from '../types/order';
import { mapApiOrder } from '../utils/mapApiOrder';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: CheckoutData) => Promise<Order>;
  updateOrderStatus: (
    id: string,
    status: Order['status'],
    reason?: string
  ) => Promise<void>;
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
      set({ orders: [], isLoading: false });
      return;
    }


   // Usuario autenticado → llamo al backend
      try {
        let ordersResp: Order[] = [];
        if (user.role === 'admin') {
          const resp = await api.get<Order[]>(`${ENDPOINTS.adminOrders}?expand=user,customerInfo`);
          ordersResp = resp.data;
        } else {
          const resp = await getOrdersByUser(user.id);
          ordersResp = resp.data;
        }
        let orders = ordersResp.map(mapApiOrder);
        orders = await Promise.all(
          orders.map(async (o) => {
            if (!o.customer?.phone || !o.customer?.address) {
              try {
                const full = await getOrderById(o.id);
                return mapApiOrder(full.data);
              } catch {
                return o;
              }
            }
            return o;
          })
        );
        set({ orders, isLoading: false });
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
      let order = mapApiOrder(resp.data);
      try {
        const full = await getOrderById(order.id);
        order = mapApiOrder(full.data);
      } catch {
        // ignore if details fetch fails
      }
      set((st) => ({
        orders: [order, ...st.orders],
        isLoading: false
      }));
      // Update stock locally based on ordered items
      const adjustStock = useProductStore.getState().adjustStock;
      adjustStock(
        data.items.map(i => ({
          productId: Number(i.productId),
          quantity: i.quantity,
        }))
      );
      window.dispatchEvent(new CustomEvent('orders-updated'));

      return order;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false
      });
      throw err;
    }
  },


  updateOrderStatus: async (id: string, status: Order['status'], reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiUpdateStatus(id, status, reason);
      let updated: Order | null = null;
      try {
        const resp = await getOrderById(id);
        updated = mapApiOrder(resp.data);
      } catch {
        // ignore if details fetch fails
      }
      set((st) => ({
        orders: st.orders.map((o) =>
          o.id === id
            ? { ...o, status, ...(reason ? { reason } : {}), ...(updated || {}) }
            : o
        ),
        isLoading: false,
      }));
      window.dispatchEvent(new CustomEvent('orders-updated'));
    } catch (err: any) {
      const message =
        err.response?.status === 400
          ? err.response?.data?.message || 'Estado inválido'
          : err.response?.data?.message || err.message;
      set({
        error: message,
        isLoading: false,
      });
      throw err;
    }
  },

  deleteOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteOrder(id);
      set((st) => ({
        orders: st.orders.filter((o) => o.id !== id),
        isLoading: false,
      }));
      window.dispatchEvent(new CustomEvent('orders-updated'));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        isLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
