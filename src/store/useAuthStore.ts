import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(ENDPOINTS.login, credentials);
          const { user, token } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(ENDPOINTS.register, data);
          const { user, token } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);