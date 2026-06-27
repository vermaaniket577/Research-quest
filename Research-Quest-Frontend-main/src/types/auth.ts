import { User } from './user';

export interface LoginResponse {
  message: string;
  token: string;
  rememberMe?: boolean;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
