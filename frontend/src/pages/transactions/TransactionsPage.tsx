import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { TransactionFormModal } from './TransactionFormModal';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/icons';
import type { Category, PagedResponse, Transaction, TransactionType } from '../../types';
import toast from 'react-hot-toast';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagedInfo, setPagedInfo] = useState<PagedResponse<Transaction> | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState<TransactionType | ''>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting & Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Modals & States
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getTransactions({
        search: search || undefined,
        type: (type as TransactionType) || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        paymentMethod: paymentMethod || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size: pageSize,
        sortBy,
        sortDir,
      });
      setTransactions(data.content);
      setPagedInfo(data);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, type, categoryId, paymentMethod, startDate, endDate, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCategoryId('');
    setPaymentMethod('');
    setStartDate('');
    setEndDate('');
    setPage(0);
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await transactionService.exportCsv({
        search: search || undefined,
        type: (type as TransactionType) || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        paymentMethod: paymentMethod || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      toast.success('Transactions exported to CSV');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(deletingId);
      toast.success('Transaction deleted');
      setDeletingId(null);
      fetchTransactions();
    } catch {
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, categorize, and export your personal finance history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingTransaction(null);
              setIsFormModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search input */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search description or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Type filter */}
            <Select value={type} onChange={(e) => { setType(e.target.value as any); setPage(0); }}>
              <option value="">All Types</option>
              <option value="EXPENSE">Expense (-)</option>
              <option value="INCOME">Income (+)</option>
            </Select>

            {/* Category filter */}
            <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </Select>

            {/* Payment method filter */}
            <Select value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setPage(0); }}>
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </Select>
          </div>

          {/* Date range filters & Reset button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Date Range:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 text-xs"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                className="border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </Card>

      {/* Transactions Table Card */}
      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No transactions found"
              description="Try adjusting your filters or record a new transaction."
              actionLabel="Add Transaction"
              onAction={() => {
                setEditingTransaction(null);
                setIsFormModalOpen(true);
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-800"
                    onClick={() => toggleSort('transactionDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Method</th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-slate-800"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Amount (₹)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Category with Icon Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                          style={{ backgroundColor: tx.categoryColor || '#6366f1' }}
                        >
                          {getCategoryIcon(tx.categoryIcon, { className: 'w-3.5 h-3.5' })}
                        </div>
                        <span className="font-medium text-slate-800 text-xs">{tx.categoryName}</span>
                      </div>
                    </td>

                    {/* Description & Notes */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{tx.description}</div>
                      {tx.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.notes}</div>}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(tx.transactionDate)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <Badge variant="neutral" size="sm">
                        {tx.paymentMethod}
                      </Badge>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span
                        className={`text-xs font-bold ${
                          tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagedInfo && (
          <Pagination
            currentPage={pagedInfo.page}
            totalPages={pagedInfo.totalPages}
            totalElements={pagedInfo.totalElements}
            pageSize={pagedInfo.size}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </Card>

      {/* Form Modal for Creating/Editing */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTransaction(null);
        }}
        onSaved={fetchTransactions}
        initialData={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction record? This will adjust your dashboard totals and budget calculations."
        confirmLabel="Delete Record"
        isLoading={isDeleting}
      />
    </div>
  );
};
