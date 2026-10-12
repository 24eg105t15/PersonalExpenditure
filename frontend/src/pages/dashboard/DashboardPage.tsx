import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Wallet,
  PiggyBank,
  Calendar,
  ArrowRight,
  PieChart as PieIcon,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CardSkeleton, TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/icons';
import { dashboardService } from '../../services/dashboardService';
import { budgetService } from '../../services/budgetService';
import { savingsService } from '../../services/savingsService';
import type {
  DashboardSummary,
  CashFlowItem,
  CategoryBreakdown,
  Transaction,
  Budget,
  SavingsGoal,
} from '../../types';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { refreshKey } = (useOutletContext() as any) || { refreshKey: 0 };

  const [period, setPeriod] = useState<string>('current_month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [showCustomRange, setShowCustomRange] = useState<boolean>(false);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowItem[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [sumData, flowData, breakData, txData, budData, savData] = await Promise.all([
        dashboardService.getSummary(
          period,
          period === 'custom' ? customStart : undefined,
          period === 'custom' ? customEnd : undefined
        ),
        dashboardService.getCashFlow(6),
        dashboardService.getCategoryBreakdown(
          'EXPENSE',
          period === 'custom' ? customStart : undefined,
          period === 'custom' ? customEnd : undefined
        ),
        dashboardService.getRecentTransactions(),
        budgetService.getBudgets(),
        savingsService.getGoals(),
      ]);

      setSummary(sumData);
      setCashFlow(flowData);
      setBreakdown(breakData);
      setRecentTransactions(txData);
      setBudgets(budData);
      setSavingsGoals(savData);
    } catch {
      toast.error('Could not load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [period, refreshKey]);

  const handleApplyCustomRange = () => {
    if (!customStart || !customEnd) {
      toast.error('Please select both start and end dates');
      return;
    }
    setPeriod('custom');
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial metrics for <strong className="text-slate-700">{summary?.periodDescription || 'Current Month'}</strong>
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-medium">
            <button
              onClick={() => {
                setPeriod('current_month');
                setShowCustomRange(false);
              }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === 'current_month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => {
                setPeriod('previous_month');
                setShowCustomRange(false);
              }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === 'previous_month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => {
                setPeriod('current_year');
                setShowCustomRange(false);
              }}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === 'current_year' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                period === 'custom' || showCustomRange ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range Panel */}
      {showCustomRange && (
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-end gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
            />
          </div>
          <Button size="sm" onClick={handleApplyCustomRange}>
            Apply Filter
          </Button>
        </div>
      )}

      {/* Primary Financial Metric Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Income */}
          <Card hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Income</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-slate-900">
                {formatCurrency(summary?.totalIncome)}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Period Earnings
              </p>
            </div>
          </Card>

          {/* Total Expenses */}
          <Card hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Expenses</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-slate-900">
                {formatCurrency(summary?.totalExpenses)}
              </div>
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                Period Outflow
              </p>
            </div>
          </Card>

          {/* Net Cash Flow */}
          <Card hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Net Cash Flow</span>
              <div className="p-2 bg-indigo-50 text-brand-600 rounded-lg">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div
                className={`text-xl font-bold ${
                  (summary?.netCashFlow ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {formatCurrency(summary?.netCashFlow)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Income minus expenses
              </p>
            </div>
          </Card>

          {/* Available Balance */}
          <Card hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Available Balance</span>
              <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-navy-950">
                {formatCurrency(summary?.availableBalance)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Cumulative account balance
              </p>
            </div>
          </Card>

          {/* Total Savings */}
          <Card hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Savings</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-slate-900">
                {formatCurrency(summary?.totalSavings)}
              </div>
              <p className="text-[11px] text-amber-600 font-medium mt-1">
                {summary?.savingsGoalsCount ?? 0} active savings goals
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Middle Section: Cash Flow & Category Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Trends Chart (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Cash Flow Trends"
            subtitle="Income vs. Expense comparison over past 6 months"
            action={
              <Link to="/reports" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                Full Report &rarr;
              </Link>
            }
          />
          <div className="h-72 w-full">
            {cashFlow.length === 0 ? (
              <EmptyState title="No cash flow data" description="Record transactions to visualize trends" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlow} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), '']}
                    contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Expense Category Breakdown Doughnut Chart (1 col) */}
        <Card>
          <CardHeader
            title="Expense by Category"
            subtitle={`Distribution for ${summary?.periodDescription || 'current period'}`}
          />
          <div className="h-56 w-full flex items-center justify-center">
            {breakdown.length === 0 ? (
              <EmptyState title="No expenses recorded" description="Add expenses to see category breakdown" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), '']}
                    contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category List under Doughnut */}
          <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
            {breakdown.slice(0, 4).map((cat) => (
              <div key={cat.categoryId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-700 font-medium truncate">{cat.categoryName}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-slate-900">{formatCurrency(cat.amount)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({cat.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section: Recent Transactions & Budgets / Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Transactions"
            subtitle="Latest transactions recorded in your account"
            action={
              <Link to="/transactions" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                View All &rarr;
              </Link>
            }
          />
          {recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="Click Add Transaction in the navigation bar to record your first entry."
            />
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: tx.categoryColor || '#6366f1' }}
                    >
                      {getCategoryIcon(tx.categoryIcon, { className: 'w-4 h-4' })}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{tx.description}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{tx.categoryName}</span>
                        <span>•</span>
                        <span>{tx.paymentMethod}</span>
                        <span>•</span>
                        <span>{formatDate(tx.transactionDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-bold ${
                        tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </div>
                    <Badge variant={tx.type === 'INCOME' ? 'success' : 'neutral'} size="sm" className="mt-0.5">
                      {tx.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Budgets & Goals Snapshot (1 col) */}
        <div className="space-y-6">
          {/* Budget Utilization Snapshot */}
          <Card>
            <CardHeader
              title="Monthly Budgets"
              subtitle="Spending limits for current month"
              action={
                <Link to="/budgets" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Manage &rarr;
                </Link>
              }
            />
            {budgets.length === 0 ? (
              <EmptyState title="No budgets set" description="Set category budgets to control spending" />
            ) : (
              <div className="space-y-3.5">
                {budgets.slice(0, 3).map((b) => (
                  <div key={b.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{b.categoryName}</span>
                      <span
                        className={`font-semibold ${
                          b.status === 'EXCEEDED'
                            ? 'text-rose-600'
                            : b.status === 'WARNING'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {formatCurrency(b.actualSpending)} / {formatCurrency(b.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          b.status === 'EXCEEDED'
                            ? 'bg-rose-500'
                            : b.status === 'WARNING'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{b.utilizationPercentage.toFixed(0)}% utilized</span>
                      <span>Remaining: {formatCurrency(b.remainingAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Savings Goals Snapshot */}
          <Card>
            <CardHeader
              title="Savings Goals"
              subtitle="Progress towards financial targets"
              action={
                <Link to="/savings-goals" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  View All &rarr;
                </Link>
              }
            />
            {savingsGoals.length === 0 ? (
              <EmptyState title="No savings goals" description="Create a savings goal to start tracking" />
            ) : (
              <div className="space-y-3">
                {savingsGoals.slice(0, 2).map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{g.name}</span>
                      <Badge variant={g.status === 'COMPLETED' ? 'success' : 'brand'} size="sm">
                        {g.progressPercentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, g.progressPercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Saved: {formatCurrency(g.currentAmount)}</span>
                      <span>Target: {formatCurrency(g.targetAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
