import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/axiosConfig';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { ENDPOINTS } from '../api/endpoints';


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
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(ENDPOINTS.login, credentials);
          const { user, token } = response.data;
          
          // ▶▶▶ Fija el token en TU instancia "api", no en axios.defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          sessionStorage.setItem('token', token);
          
          
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
          
          // ▶▶▶ Si tras registro quieres auto-login, fija también el header:
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          sessionStorage.setItem('token', token);

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
        // ▶▶▶ Limpia el header de TU instancia "api"
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, error: null });
        // ▶▶▶ persist ya borra el storage; no hace falta removeItem manual
        sessionStorage.removeItem('token');
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
