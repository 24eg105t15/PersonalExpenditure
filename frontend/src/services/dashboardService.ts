import { api } from './api';
import type { ApiResponse, CashFlowItem, CategoryBreakdown, DashboardSummary, Transaction, TransactionType } from '../types';

export const dashboardService = {
  async getSummary(period = 'current_month', startDate?: string, endDate?: string) {
    const res = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary', {
      params: { period, startDate, endDate },
    });
    return res.data.data;
  },

  async getCashFlow(months = 6) {
    const res = await api.get<ApiResponse<CashFlowItem[]>>('/dashboard/cash-flow', {
      params: { months },
    });
    return res.data.data;
  },

  async getCategoryBreakdown(type: TransactionType = 'EXPENSE', startDate?: string, endDate?: string) {
    const res = await api.get<ApiResponse<CategoryBreakdown[]>>('/dashboard/category-breakdown', {
      params: { type, startDate, endDate },
    });
    return res.data.data;
  },

  async getRecentTransactions() {
    const res = await api.get<ApiResponse<Transaction[]>>('/dashboard/recent-transactions');
    return res.data.data;
  },
};
