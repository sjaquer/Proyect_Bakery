import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, User } from '../types/auth';

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // In production, this would be hashed
    role: 'admin' as const,
    name: 'Administrator',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'manager' as const,
    name: 'Order Manager',
  },
];

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkLockStatus: () => boolean;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loginAttempts: 0,
      lastAttemptTime: null,
      isLocked: false,

      checkLockStatus: () => {
        const { isLocked, lastAttemptTime } = get();
        if (!isLocked || !lastAttemptTime) return false;
        
        const now = Date.now();
        const timePassed = now - lastAttemptTime;
        
        if (timePassed >= LOCK_DURATION) {
          set({ isLocked: false, loginAttempts: 0, lastAttemptTime: null });
          return false;
        }
        
        return true;
      },

      login: async (credentials: LoginCredentials) => {
        const { loginAttempts, lastAttemptTime } = get();
        const now = Date.now();

        // Check if account is locked
        if (get().checkLockStatus()) {
          const remainingTime = Math.ceil((LOCK_DURATION - (now - (lastAttemptTime || 0))) / 60000);
          throw new Error(`Account is locked. Try again in ${remainingTime} minutes.`);
        }

        // Find user
        const user = MOCK_USERS.find(u => u.username === credentials.username);
        
        if (!user || user.password !== credentials.password) {
          const newAttempts = loginAttempts + 1;
          const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
          
          set({
            loginAttempts: newAttempts,
            lastAttemptTime: now,
            isLocked: shouldLock,
          });

          if (shouldLock) {
            throw new Error(`Too many failed attempts. Account locked for 15 minutes.`);
          }

          throw new Error(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
        }

        // Successful login
        const { password, ...safeUser } = user;
        set({
          user: safeUser,
          token: 'mock-jwt-token', // In production, this would be a real JWT
          loginAttempts: 0,
          lastAttemptTime: null,
          isLocked: false,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;