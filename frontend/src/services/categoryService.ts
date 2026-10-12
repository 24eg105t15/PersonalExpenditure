import { api } from './api';
import type { ApiResponse, Category, TransactionType } from '../types';

export interface CategoryPayload {
  name: string;
  type: TransactionType;
  icon: string;
  color?: string;
}

export const categoryService = {
  async getCategories(type?: TransactionType) {
    const res = await api.get<ApiResponse<Category[]>>('/categories', { params: { type } });
    return res.data.data;
  },

  async createCategory(payload: CategoryPayload) {
    const res = await api.post<ApiResponse<Category>>('/categories', payload);
    return res.data.data;
  },

  async updateCategory(id: number, payload: CategoryPayload) {
    const res = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return res.data.data;
  },

  async deleteCategory(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return res.data;
  },
};
