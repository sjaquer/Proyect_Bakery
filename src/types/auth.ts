export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loginAttempts: number;
  lastAttemptTime: number | null;
  isLocked: boolean;
}