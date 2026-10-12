import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { BudgetFormModal } from './BudgetFormModal';
import { budgetService } from '../../services/budgetService';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/icons';
import type { Budget, BudgetSummary } from '../../types';
import toast from 'react-hot-toast';

export const BudgetsPage: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const data = await budgetService.getBudgetSummary(selectedMonth, selectedYear);
      setSummary(data);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await budgetService.deleteBudget(deletingId);
      toast.success('Budget deleted');
      setDeletingId(null);
      loadBudgets();
    } catch {
      toast.error('Failed to delete budget');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Budgets & Limits</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track planned category limits against real expense transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector Carousel Buttons */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-3 whitespace-nowrap min-w-[110px] text-center">
              {formatMonthYear(selectedMonth, selectedYear)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Budget
          </Button>
        </div>
      </div>

      {/* Monthly Summary Statistics Banner */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
            <span className="text-xs font-medium text-slate-500">Total Planned Budget</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(summary.totalBudget)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
            <span className="text-xs font-medium text-slate-500">Total Actual Spending</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {formatCurrency(summary.totalSpending)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
            <span className="text-xs font-medium text-slate-500">Remaining Budget</span>
            <div
              className={`text-xl font-bold mt-1 ${
                summary.remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(summary.remainingBudget)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
            <span className="text-xs font-medium text-slate-500">Overall Utilization</span>
            <div className="text-xl font-bold text-brand-600 mt-1">
              {summary.overallUtilization.toFixed(1)}%
            </div>
          </Card>
        </div>
      )}

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !summary || summary.budgets.length === 0 ? (
        <Card className="p-10">
          <EmptyState
            icon={<PieChart className="w-8 h-8 text-brand-600" />}
            title="No budgets set for this month"
            description="Create planned spending limits for categories such as Groceries, Dining, and Rent."
            actionLabel="Create Budget"
            onAction={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {summary.budgets.map((budget) => {
            const isExceeded = budget.status === 'EXCEEDED';
            const isWarning = budget.status === 'WARNING';

            return (
              <Card key={budget.id} hoverEffect className="p-5 flex flex-col justify-between">
                <div>
                  {/* Card Header: Category & Actions */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                        style={{ backgroundColor: budget.categoryColor || '#6366f1' }}
                      >
                        {getCategoryIcon(budget.categoryIcon, { className: 'w-4 h-4' })}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{budget.categoryName}</h3>
                        <span className="text-[10px] text-slate-400">
                          Threshold: {budget.warningThreshold}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingBudget(budget);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(budget.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Spending Numbers */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Actual Spent</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(budget.actualSpending)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Planned Limit</div>
                      <div className="text-sm font-semibold text-slate-700">
                        {formatCurrency(budget.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded
                            ? 'bg-rose-500'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-label */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {budget.utilizationPercentage.toFixed(1)}% used
                    </span>
                    <span
                      className={`font-medium ${
                        budget.remainingAmount < 0 ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {budget.remainingAmount < 0
                        ? `Over by ${formatCurrency(Math.abs(budget.remainingAmount))}`
                        : `${formatCurrency(budget.remainingAmount)} left`}
                    </span>
                  </div>
                </div>

                {/* Status pill footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isExceeded ? (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      <ShieldAlert className="w-4 h-4" /> Budget Limit Exceeded
                    </div>
                  ) : isWarning ? (
                    <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                      <AlertTriangle className="w-4 h-4" /> Approaching Warning Limit
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Comfortably on Track
                    </div>
                  )}

                  <Badge
                    variant={isExceeded ? 'danger' : isWarning ? 'warning' : 'success'}
                    size="sm"
                  >
                    {budget.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <BudgetFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSaved={loadBudgets}
        initialData={editingBudget}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message="Are you sure you want to delete this budget limit? Your transaction history will remain intact."
        confirmLabel="Delete Budget"
        isLoading={isDeleting}
      />
    </div>
  );
};
