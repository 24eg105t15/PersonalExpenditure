export type TransactionType = 'INCOME' | 'EXPENSE';
export type SavingsGoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type SavingsEntryType = 'CONTRIBUTION' | 'WITHDRAWAL';

export interface User {
  id: number;
  fullName: string;
  email: string;
  enabled: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault: boolean;
  isCustom: boolean;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  description: string;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  transactionDate: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  actualSpending: number;
  remainingAmount: number;
  utilizationPercentage: number;
  month: number;
  year: number;
  warningThreshold: number;
  status: 'NORMAL' | 'WARNING' | 'EXCEEDED';
  createdAt: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpending: number;
  remainingBudget: number;
  overallUtilization: number;
  month: number;
  year: number;
  budgets: Budget[];
}

export interface SavingsGoal {
  id: number;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  targetDate: string;
  status: SavingsGoalStatus;
  createdAt: string;
}

export interface SavingsGoalEntry {
  id: number;
  savingsGoalId: number;
  type: SavingsEntryType;
  amount: number;
  notes?: string;
  entryDate: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  availableBalance: number;
  totalSavings: number;
  savingsGoalsCount: number;
  totalBudget: number;
  totalBudgetSpending: number;
  budgetUtilization: number;
  periodDescription: string;
  startDate: string;
  endDate: string;
}

export interface CashFlowItem {
  period: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  color: string;
  icon: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingTrendItem {
  date: string;
  amount: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: CategoryBreakdown[];
  dailyTrends: SpendingTrendItem[];
  budgetPerformance: Budget[];
}

export interface UserSettings {
  id: number;
  currency: string;
  dateFormat: string;
  theme: string;
  monthlyBudgetAlert: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
