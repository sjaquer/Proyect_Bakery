// src/store/useStore.ts
import { create } from 'zustand';
import api from '../api/axiosConfig';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
};

type State = {
  products: Product[];
  fetchProducts: () => Promise<void>;
};

export const useStore = create<State>((set) => ({
  products: [],
  fetchProducts: async () => {
    try {
      const resp = await api.get<Product[]>('/products');
      set({ products: resp.data || [] });
    } catch (e) {
      console.error('Error fetching products:', e);
      set({ products: [] });
    }
  },
}));
