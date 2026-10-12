import { api } from './api';
import type { ApiResponse, Budget, BudgetSummary } from '../types';

export interface BudgetPayload {
  categoryId: number;
  amount: number;
  month: number;
  year: number;
  warningThreshold?: number;
}

export const budgetService = {
  async getBudgets(month?: number, year?: number) {
    const res = await api.get<ApiResponse<Budget[]>>('/budgets', { params: { month, year } });
    return res.data.data;
  },

  async getBudgetSummary(month?: number, year?: number) {
    const res = await api.get<ApiResponse<BudgetSummary>>('/budgets/summary', { params: { month, year } });
    return res.data.data;
  },

  async createBudget(payload: BudgetPayload) {
    const res = await api.post<ApiResponse<Budget>>('/budgets', payload);
    return res.data.data;
  },

  async updateBudget(id: number, payload: BudgetPayload) {
    const res = await api.put<ApiResponse<Budget>>(`/budgets/${id}`, payload);
    return res.data.data;
  },

  async deleteBudget(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/budgets/${id}`);
    return res.data;
  },
};
