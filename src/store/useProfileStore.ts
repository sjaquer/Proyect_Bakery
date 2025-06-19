import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/endpoints';
import type { Customer } from '../types/order';

interface ProfileState {
  profile: Customer | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name: string; email: string; phone: string; address: string }) => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const resp = await api.get<Customer>(ENDPOINTS.userProfile);
          const data: any = resp.data;
          set({
            profile: {
              ...resp.data,
              phone: data.phone ?? data.Phone ?? '',
              address: data.address ?? data.Address ?? '',
              role: data.role ?? data.Role,
              createdAt: data.createdAt ?? data.created_at,
              updatedAt: data.updatedAt ?? data.updated_at,
            },
            isLoading: false,
          });
          set({ profile: resp.data, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const resp = await api.put<Customer>(ENDPOINTS.userProfile, data);
          const resData: any = resp.data;
          set({
            profile: {
              ...resp.data,
              phone: resData.phone ?? resData.Phone ?? '',
              address: resData.address ?? resData.Address ?? '',
              role: resData.role ?? resData.Role,
              createdAt: resData.createdAt ?? resData.created_at,
              updatedAt: resData.updatedAt ?? resData.updated_at,
            },
            isLoading: false,
          });
          set({ profile: resp.data, isLoading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || err.message,
            isLoading: false,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
