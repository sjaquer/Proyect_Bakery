// src/store/useAuthStore.ts

import { create } from 'zustand';
import api from '../api/axiosConfig';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};

type AuthState = {
  user: User | null;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  error: null,

  login: async (email, password) => {
    try {
      set({ error: null });
      const resp = await api.post('/auth/login', { email, password });
      const { id, name, role, token } = resp.data;
      const user = { id, name, email, role } as User;
      set({ user, token });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      set({ error: msg });
      throw new Error(msg);
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
}));
