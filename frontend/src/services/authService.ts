import { api } from './api';
import type { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  async register(data: { fullName: string; email: string; password: string; confirmPassword: string }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  async getCurrentUser() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('spendwise_token');
    localStorage.removeItem('spendwise_user');
  },
};
