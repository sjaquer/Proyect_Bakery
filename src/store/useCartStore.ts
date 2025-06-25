import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/order';
import { useProductStore } from './useProductStore';

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (newItem, qty = 1) => {
        if (qty <= 0) return;

        const stock = useProductStore
          .getState()
          .products.find(p => String(p.id) === String(newItem.id))?.stock ?? Infinity;

        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);

          let updatedItems = state.items;
          if (existingItem) {
            const newQty = Math.min(existingItem.quantity + qty, stock);
            updatedItems = state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: newQty }
                : item
            );
          } else {
            if (stock <= 0) return state;
            updatedItems = [...state.items, { ...newItem, quantity: Math.min(qty, stock) }];
          }

          const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return { items: updatedItems, total };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.id !== id);
          const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return { items: updatedItems, total };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const stock = useProductStore
          .getState()
          .products.find(p => String(p.id) === String(id))?.stock ?? Infinity;

        const newQty = quantity > stock ? stock : quantity;

        set((state) => {
          const updatedItems = state.items.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
          );
          const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return { items: updatedItems, total };
        });
      },

      clearCart: () => set({ items: [], total: 0 }),

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);