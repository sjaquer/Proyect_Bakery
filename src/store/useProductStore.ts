import { create } from 'zustand';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import type { Product, ProductFormData } from '../types/product';
import { mapApiProduct } from '../utils/mapApiProduct';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<void>;
  updateProduct: (id: string, data: ProductFormData) => Promise<void>;
  toggleFeatured: (id: string, featured: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (items: { productId: number; quantity: number }[]) => void;
  clearError: () => void;
}


export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Product[]>(ENDPOINTS.products);
      const mapped = response.data.map(mapApiProduct);
      set({ products: mapped, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false 
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Product>(ENDPOINTS.productById(id));
      set({
        selectedProduct: mapApiProduct(response.data),
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product',
        isLoading: false 
      });
    }
  },

  createProduct: async (data: ProductFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Product>(ENDPOINTS.adminProducts, data);
      const newProduct = mapApiProduct(response.data);
      set(state => ({ 
        products: [...state.products, newProduct],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create product',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProduct: async (id: string, data: ProductFormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<Product>(ENDPOINTS.productById(id), data);
      const updated = mapApiProduct(response.data);
      set(state => ({
        products: state.products.map(p => p.id === id ? updated : p),
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update product',
        isLoading: false
      });
      throw error;
    }
  },

  toggleFeatured: async (id: string, featured: boolean) => {
    const state = get();
    const product = state.products.find(p => p.id === id);
    if (!product) return;
    const data: ProductFormData = {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      category: product.category,
      stock: product.stock,
      ingredients: product.ingredients,
      allergens: product.allergens,
      featured,
    };
    await state.updateProduct(id, data);
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(ENDPOINTS.productById(id));
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        isLoading: false
      });
      throw error;
    }
  },

  adjustStock: (items) => {
    set(state => ({
      products: state.products.map(p => {
        const item = items.find(i => String(i.productId) === String(p.id));
        return item ? { ...p, stock: p.stock - item.quantity } : p;
      })
    }));
  },

  clearError: () => set({ error: null })
}));
