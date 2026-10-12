import { api } from './api';
import type { ApiResponse, User, UserSettings } from '../types';

export const profileService = {
  async getProfile() {
    const res = await api.get<ApiResponse<User>>('/profile');
    return res.data.data;
  },

  async updateProfile(data: { fullName: string; email: string }) {
    const res = await api.put<ApiResponse<User>>('/profile', data);
    return res.data.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    const res = await api.put<ApiResponse<null>>('/profile/password', data);
    return res.data;
  },

  async getSettings() {
    const res = await api.get<ApiResponse<UserSettings>>('/settings');
    return res.data.data;
  },

  async updateSettings(data: { currency: string; dateFormat: string; theme: string; monthlyBudgetAlert: boolean }) {
    const res = await api.put<ApiResponse<UserSettings>>('/settings', data);
    return res.data.data;
  },
};
