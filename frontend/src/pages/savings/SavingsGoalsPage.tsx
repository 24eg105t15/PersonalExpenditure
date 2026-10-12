import React, { useEffect, useState } from 'react';
import {
  PiggyBank,
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Edit2,
  Trash2,
  History,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { SavingsGoalFormModal } from './SavingsGoalFormModal';
import { SavingsEntryModal } from './SavingsEntryModal';
import { savingsService } from '../../services/savingsService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { SavingsGoal } from '../../types';
import toast from 'react-hot-toast';

export const SavingsGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  // Entry modal
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedGoalForEntry, setSelectedGoalForEntry] = useState<SavingsGoal | null>(null);

  // Delete dialog
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const data = await savingsService.getGoals();
      setGoals(data);
    } catch {
      toast.error('Failed to load savings goals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const totalSavedAll = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTargetAll = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const completedCount = goals.filter((g) => g.status === 'COMPLETED').length;

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await savingsService.deleteGoal(deletingId);
      toast.success('Savings goal deleted');
      setDeletingId(null);
      loadGoals();
    } catch {
      toast.error('Failed to delete goal');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Savings Goals</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build wealth, plan milestone purchases, and track emergency reserves
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingGoal(null);
            setIsFormModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Savings Goal
        </Button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
          <span className="text-xs font-medium text-slate-500">Total Capital Saved</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalSavedAll)}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
          <span className="text-xs font-medium text-slate-500">Cumulative Target</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalTargetAll)}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-white to-slate-50/50">
          <span className="text-xs font-medium text-slate-500">Completed Goals</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {completedCount} of {goals.length}
          </div>
        </Card>
      </div>

      {/* Goals Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <Card className="p-10">
          <EmptyState
            icon={<PiggyBank className="w-8 h-8 text-brand-600" />}
            title="No savings goals yet"
            description="Start building your savings habit today by setting a target for emergencies, travel, or education."
            actionLabel="Create Savings Goal"
            onAction={() => {
              setEditingGoal(null);
              setIsFormModalOpen(true);
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const isCompleted = goal.status === 'COMPLETED';

            return (
              <Card key={goal.id} hoverEffect className="p-5 flex flex-col justify-between">
                <div>
                  {/* Top Bar: Title, status badge, action buttons */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{goal.name}</h3>
                        <Badge variant={isCompleted ? 'success' : 'brand'} size="sm">
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{goal.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(goal.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Financial Targets */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-500">Current Saved</span>
                      <div className="text-xl font-bold text-slate-900">{formatCurrency(goal.currentAmount)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500">Target</span>
                      <div className="text-sm font-semibold text-slate-700">{formatCurrency(goal.targetAmount)}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                        }`}
                        style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Remaining & Target Date */}
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-brand-700">
                      {goal.progressPercentage.toFixed(1)}% achieved
                    </span>
                    <span>Remaining: {formatCurrency(goal.remainingAmount)}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Target Date: {formatDate(goal.targetDate)}</span>
                  </div>
                </div>

                {/* Footer Action: Deposit / Withdrawal */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedGoalForEntry(goal);
                      setIsEntryModalOpen(true);
                    }}
                    leftIcon={<History className="w-3.5 h-3.5" />}
                  >
                    Deposit / Withdraw
                  </Button>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Goal Met!
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Form Modal */}
      <SavingsGoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSaved={loadGoals}
        initialData={editingGoal}
      />

      {/* Deposit/Withdrawal Modal */}
      <SavingsEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setSelectedGoalForEntry(null);
        }}
        onSaved={loadGoals}
        goal={selectedGoalForEntry}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal? Its deposit history will also be removed."
        confirmLabel="Delete Goal"
        isLoading={isDeleting}
      />
    </div>
  );
};
