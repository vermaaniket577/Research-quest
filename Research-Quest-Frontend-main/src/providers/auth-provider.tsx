'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/axios';
import { User } from '@/types/user';
import { LoginResponse, RegisterResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearError = useCallback(() => setError(null), []);

  // Fetch the current authenticated user profile
  const fetchCurrentUser = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<{ user: User }>('/auth/me');
      setUser(response.data.user);
    } catch (err: any) {
      console.error('Session restore failed:', err);
      // Clean up cookies if token is expired/invalid
      Cookies.remove('token', { path: '/' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run on mount to restore user session if cookie exists
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login handler
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const { token, user: loggedUser } = response.data;
      
      // Store the token in standard cookies (expires: 7 days or 30 days if rememberMe is checked)
      const expires = rememberMe ? 30 : 7;
      Cookies.set('token', token, { expires, path: '/' });
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Registration handler
  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      const { token, user: registeredUser } = response.data;

      // Save token in cookie
      Cookies.set('token', token, { expires: 7, path: '/' });
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      // Clear all state regardless of API success
      Cookies.remove('token', { path: '/' });
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
