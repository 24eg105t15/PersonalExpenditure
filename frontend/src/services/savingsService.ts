import { api } from './api';
import type { ApiResponse, SavingsEntryType, SavingsGoal, SavingsGoalEntry } from '../types';

export interface SavingsGoalPayload {
  name: string;
  description?: string;
  targetAmount: number;
  initialAmount?: number;
  targetDate: string;
}

export interface SavingsGoalEntryPayload {
  type: SavingsEntryType;
  amount: number;
  notes?: string;
  entryDate: string;
}

export const savingsService = {
  async getGoals() {
    const res = await api.get<ApiResponse<SavingsGoal[]>>('/savings-goals');
    return res.data.data;
  },

  async getGoal(id: number) {
    const res = await api.get<ApiResponse<SavingsGoal>>(`/savings-goals/${id}`);
    return res.data.data;
  },

  async createGoal(payload: SavingsGoalPayload) {
    const res = await api.post<ApiResponse<SavingsGoal>>('/savings-goals', payload);
    return res.data.data;
  },

  async updateGoal(id: number, payload: SavingsGoalPayload) {
    const res = await api.put<ApiResponse<SavingsGoal>>(`/savings-goals/${id}`, payload);
    return res.data.data;
  },

  async deleteGoal(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/savings-goals/${id}`);
    return res.data;
  },

  async addEntry(goalId: number, payload: SavingsGoalEntryPayload) {
    const res = await api.post<ApiResponse<SavingsGoal>>(`/savings-goals/${goalId}/entries`, payload);
    return res.data.data;
  },

  async getEntries(goalId: number) {
    const res = await api.get<ApiResponse<SavingsGoalEntry[]>>(`/savings-goals/${goalId}/entries`);
    return res.data.data;
  },
};
