import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types/order';

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
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

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id);
          
          let updatedItems;
          if (existingItem) {
            updatedItems = state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

        set((state) => {
          const updatedItems = state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          );
          const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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