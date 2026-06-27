import { api } from '@/lib/axios';

export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution?: string;
  researchDomain?: string;
}

export async function registerUser(userData: RegisterUserData) {
  const res = await api.post('/auth/register', userData);
  return res.data;
}

export async function loginUser(email: string, password: string, rememberMe: boolean = false) {
  const res = await api.post('/auth/login', { email, password, rememberMe });
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(token: string, newPassword: string, confirmNewPassword: string) {
  const res = await api.post('/auth/reset-password', { token, newPassword, confirmNewPassword });
  return res.data;
}

export async function getCurrentUser(token?: string) {
  // Access token cookie is attached automatically by the Axios request interceptor.
  // We keep the optional parameter for interface compatibility.
  const res = await api.get('/auth/me');
  return res.data;
}

export async function getDashboard(token?: string) {
  const res = await api.get('/dashboard');
  return res.data;
}

export function getGoogleAuthUrl(): string {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return `${API_URL}/auth/google`;
}