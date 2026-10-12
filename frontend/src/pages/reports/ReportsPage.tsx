import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { reportService } from '../../services/reportService';
import { transactionService } from '../../services/transactionService';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import type { MonthlyReport } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getMonthlyReport(selectedMonth, selectedYear);
      setReport(data);
    } catch {
      toast.error('Failed to load monthly report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportMonthCsv = async () => {
    setIsExporting(true);
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${lastDay}`;

    try {
      await transactionService.exportCsv({ startDate, endDate });
      toast.success('Monthly transactions exported to CSV');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audited monthly performance, savings rates, and category distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 px-3 whitespace-nowrap min-w-[120px] text-center">
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
            variant="outline"
            size="sm"
            onClick={handleExportMonthCsv}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Report
          </Button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block pb-4 mb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold text-slate-900">SpendWise Monthly Financial Statement</h1>
        <p className="text-sm text-slate-600 mt-1">
          Period: {formatMonthYear(selectedMonth, selectedYear)} | Prepared on: {new Date().toLocaleDateString('en-IN')}
        </p>
      </div>

      {/* Summary KPI Banner */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:grid-cols-4">
          <Card className="p-4 print-card">
            <span className="text-xs font-medium text-slate-500">Gross Income</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              {formatCurrency(report.totalIncome)}
            </div>
          </Card>

          <Card className="p-4 print-card">
            <span className="text-xs font-medium text-slate-500">Total Expenditure</span>
            <div className="text-xl font-bold text-rose-600 mt-1">
              {formatCurrency(report.totalExpense)}
            </div>
          </Card>

          <Card className="p-4 print-card">
            <span className="text-xs font-medium text-slate-500">Net Retained Savings</span>
            <div
              className={`text-xl font-bold mt-1 ${
                report.netSavings >= 0 ? 'text-brand-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(report.netSavings)}
            </div>
          </Card>

          <Card className="p-4 print-card">
            <span className="text-xs font-medium text-slate-500">Savings Rate</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {report.savingsRate.toFixed(1)}%
            </div>
          </Card>
        </div>
      ) : null}

      {/* Daily Spending Trend Chart */}
      <Card className="print-card">
        <CardHeader
          title="Daily Spending Curve"
          subtitle={`Day-by-day expense timeline for ${formatMonthYear(selectedMonth, selectedYear)}`}
        />
        <div className="h-64 w-full">
          {!report || report.dailyTrends.length === 0 ? (
            <EmptyState title="No daily transactions" description="No daily expenses recorded for this month" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.dailyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => val.slice(-2)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Spent']}
                  contentStyle={{ borderRadius: '0.75rem', borderColor: '#e2e8f0', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Category Spending Table & Budget Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Table */}
        <Card className="print-card">
          <CardHeader
            title="Spending by Category"
            subtitle="Sorted from highest expenditure to lowest"
          />
          {!report || report.categoryBreakdown.length === 0 ? (
            <EmptyState title="No categories tracked" description="No expenses recorded this month" />
          ) : (
            <div className="divide-y divide-slate-100">
              {report.categoryBreakdown.map((c) => (
                <div key={c.categoryId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="font-semibold text-slate-800">{c.categoryName}</span>
                    <span className="text-[11px] text-slate-400">({c.transactionCount} txs)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(c.amount)}</span>
                    <span className="text-slate-500 ml-2 font-medium">({c.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Budget Performance Table */}
        <Card className="print-card">
          <CardHeader
            title="Budget Utilization Report"
            subtitle="Actual vs planned limit per category"
          />
          {!report || report.budgetPerformance.length === 0 ? (
            <EmptyState title="No budgets for period" description="No monthly budgets established" />
          ) : (
            <div className="divide-y divide-slate-100">
              {report.budgetPerformance.map((b) => (
                <div key={b.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{b.categoryName}</span>
                    <div className="space-x-2">
                      <span className="text-slate-600">
                        {formatCurrency(b.actualSpending)} / {formatCurrency(b.amount)}
                      </span>
                      <Badge
                        variant={
                          b.status === 'EXCEEDED' ? 'danger' : b.status === 'WARNING' ? 'warning' : 'success'
                        }
                        size="sm"
                      >
                        {b.utilizationPercentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        b.status === 'EXCEEDED'
                          ? 'bg-rose-500'
                          : b.status === 'WARNING'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
