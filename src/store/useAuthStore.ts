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
          
        // Fija el token en tu instancia "api" para todas las peticiones
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          localStorage.setItem('token', token);
          // El middleware de persist ya guarda user+token; no hace falta el setItem aquí
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
        // Limpia el header de tu instancia "api"
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, error: null });
        localStorage.removeItem('auth-storage');
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