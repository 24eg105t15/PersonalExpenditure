import { api } from './api';
import type { ApiResponse, PagedResponse, Transaction, TransactionType } from '../types';

export interface TransactionFilterParams {
  type?: TransactionType;
  categoryId?: number;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: number;
  transactionDate: string;
  paymentMethod: string;
  notes?: string;
}

export const transactionService = {
  async getTransactions(params: TransactionFilterParams = {}) {
    const res = await api.get<ApiResponse<PagedResponse<Transaction>>>('/transactions', { params });
    return res.data.data;
  },

  async getTransaction(id: number) {
    const res = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return res.data.data;
  },

  async createTransaction(payload: TransactionPayload) {
    const res = await api.post<ApiResponse<Transaction>>('/transactions', payload);
    return res.data.data;
  },

  async updateTransaction(id: number, payload: TransactionPayload) {
    const res = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, payload);
    return res.data.data;
  },

  async deleteTransaction(id: number) {
    const res = await api.delete<ApiResponse<null>>(`/transactions/${id}`);
    return res.data;
  },

  async exportCsv(params: TransactionFilterParams = {}) {
    const res = await api.get('/transactions/export/csv', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spendwise_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },
};
