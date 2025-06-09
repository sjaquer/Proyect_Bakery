// src/store/useStore.ts

import { create } from 'zustand';
import api from '../api/axiosConfig';

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

type State = {
  // Productos
  products: Product[];
  fetchProducts: () => Promise<void>;
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  }) => Promise<void>;
  updateProduct: (
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      category?: string;
      imageUrl?: string;
    }
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  // Carrito
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Autenticación
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: 'customer'
  ) => Promise<void>;
  logout: () => void;

  // Órdenes cliente
  customerOrders: any[];
  fetchCustomerOrders: (clientId: number) => Promise<void>;

  // Órdenes admin
  allOrders: any[];
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: number, newStatus: string) => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  // =========================
  // Productos
  products: [],
  fetchProducts: async () => {
    try {
      // forzamos respuesta como texto para poder interceptar HTML
      const resp = await api.get('/products', { responseType: 'text' });
      let raw = resp.data as string;
      let productsArray: Product[] = [];

      // 1) Si es HTML de Ngrok con JSON dentro de <pre>
      if (raw.trim().startsWith('<!DOCTYPE html>')) {
        const match = raw.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            if (Array.isArray(parsed)) {
              productsArray = parsed;
            }
          } catch (err) {
            console.warn('❌ No se pudo parsear JSON desde HTML:', err);
          }
        }
      }
      // 2) Si es JSON puro
      else {
        const json = JSON.parse(raw);
        if (Array.isArray(json)) {
          productsArray = json;
        } else if (json && Array.isArray((json as any).products)) {
          productsArray = (json as any).products;
        }
      }

      set({ products: productsArray });
      console.log('📦 Productos cargados:', productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
  createProduct: async (data) => {
    try {
      await api.post('/products', data);
      get().fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  updateProduct: async (id, data) => {
    try {
      await api.put(`/products/${id}`, data);
      get().fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      get().fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // =========================
  // Carrito
  cartItems: (() => {
    try {
      const stored = localStorage.getItem('cart');
      const parsed = JSON.parse(stored || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })(),
  addToCart: (item) => {
    set((state) => {
      const exists = state.cartItems.find(ci => ci.productId === item.productId);
      let updatedCart;
      if (exists) {
        updatedCart = state.cartItems.map(ci =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        );
      } else {
        updatedCart = [...state.cartItems, item];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cartItems: updatedCart };
    });
  },
  updateCartItemQuantity: (productId, quantity) => {
    set((state) => {
      const updatedCart = state.cartItems.map(ci =>
        ci.productId === productId ? { ...ci, quantity } : ci
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cartItems: updatedCart };
    });
  },
  removeFromCart: (productId) => {
    set((state) => {
      const updatedCart = state.cartItems.filter(ci => ci.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { cartItems: updatedCart };
    });
  },
  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem('cart');
  },
  getCartTotal: () => {
    const ci = get().cartItems;
    return Array.isArray(ci)
      ? ci.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : 0;
  },

  // =========================
  // Autenticación
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  login: async (email, password) => {
    try {
      const resp = await api.post('/auth/login', { email, password });
      const { id, name, email: userEmail, role, token } = resp.data;
      const userObj: User = { id, name, email: userEmail, role };
      set({ user: userObj, token });
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Error en login:', error.response?.data || error);
      throw error;
    }
  },
  register: async (name, email, password, role = 'customer') => {
    try {
      const resp = await api.post('/auth/register', { name, email, password, role });
      const { id, name: nm, email: userEmail, role: rl, token } = resp.data;
      const userObj: User = { id, name: nm, email: userEmail, role: rl };
      set({ user: userObj, token });
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Error en register:', error.response?.data || error);
      throw error;
    }
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // =========================
  // Órdenes de cliente
  customerOrders: [],
  fetchCustomerOrders: async (clientId) => {
    try {
      const resp = await api.get(`/orders?clientId=${clientId}`);
      set({ customerOrders: resp.data });
    } catch (error) {
      console.error('Error fetching customer orders:', error);
    }
  },

  // =========================
  // Órdenes admin
  allOrders: [],
  fetchAllOrders: async () => {
    try {
      const resp = await api.get('/orders');
      set({ allOrders: resp.data });
    } catch (error) {
      console.error('Error fetching all orders:', error);
    }
  },
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      set((state) => ({
        allOrders: state.allOrders.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ),
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  },
}));
