import { api } from './api';
import type { ApiResponse, CashFlowItem, MonthlyReport } from '../types';

export const reportService = {
  async getMonthlyReport(month?: number, year?: number) {
    const res = await api.get<ApiResponse<MonthlyReport>>('/reports/monthly', {
      params: { month, year },
    });
    return res.data.data;
  },

  async getCashFlowReport(year?: number) {
    const res = await api.get<ApiResponse<CashFlowItem[]>>('/reports/cash-flow', {
      params: { year },
    });
    return res.data.data;
  },
};
