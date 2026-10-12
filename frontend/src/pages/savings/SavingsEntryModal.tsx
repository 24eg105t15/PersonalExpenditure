import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { savingsService } from '../../services/savingsService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { SavingsGoal, SavingsGoalEntry } from '../../types';
import toast from 'react-hot-toast';

const entrySchema = z.object({
  type: z.enum(['CONTRIBUTION', 'WITHDRAWAL']),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  notes: z.string().max(255).optional(),
  entryDate: z.string().min(1, 'Date is required'),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface SavingsEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  goal: SavingsGoal | null;
}

export const SavingsEntryModal: React.FC<SavingsEntryModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  goal,
}) => {
  const [entries, setEntries] = useState<SavingsGoalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: 'CONTRIBUTION',
      amount: undefined,
      notes: '',
      entryDate: new Date().toISOString().slice(0, 10),
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (isOpen && goal) {
      reset({
        type: 'CONTRIBUTION',
        amount: undefined,
        notes: '',
        entryDate: new Date().toISOString().slice(0, 10),
      });
      setIsLoadingEntries(true);
      savingsService
        .getEntries(goal.id)
        .then(setEntries)
        .catch(() => {})
        .finally(() => setIsLoadingEntries(false));
    }
  }, [isOpen, goal, reset]);

  if (!goal) return null;

  const onSubmit = async (values: EntryFormValues) => {
    try {
      await savingsService.addEntry(goal.id, values);
      toast.success(
        values.type === 'CONTRIBUTION'
          ? `Added ${formatCurrency(values.amount)} to ${goal.name}`
          : `Withdrew ${formatCurrency(values.amount)} from ${goal.name}`
      );
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to record entry';
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Goal: ${goal.name}`}
      subtitle={`Current saved: ${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Entry Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Record Deposit or Withdrawal
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select label="Action Type *" error={errors.type?.message} {...register('type')}>
              <option value="CONTRIBUTION">Deposit / Contribution (+)</option>
              <option value="WITHDRAWAL">Withdrawal (-)</option>
            </Select>

            <Input
              label="Amount (INR ₹) *"
              type="number"
              step="0.01"
              placeholder="e.g. 5000.00"
              error={errors.amount?.message}
              {...register('amount')}
            />

            <Input
              label="Date *"
              type="date"
              error={errors.entryDate?.message}
              {...register('entryDate')}
            />
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Monthly allocation, bonus contribution, emergency expense"
            error={errors.notes?.message}
            {...register('notes')}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              variant={selectedType === 'CONTRIBUTION' ? 'success' : 'danger'}
              isLoading={isSubmitting}
            >
              {selectedType === 'CONTRIBUTION' ? 'Add Deposit' : 'Record Withdrawal'}
            </Button>
          </div>
        </form>

        {/* History Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Contribution History ({entries.length})
          </h4>

          {isLoadingEntries ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading history...</div>
          ) : entries.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
              No entries recorded yet.
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
              {entries.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.type === 'CONTRIBUTION' ? 'success' : 'danger'} size="sm">
                        {item.type === 'CONTRIBUTION' ? '+ Deposit' : '- Withdrawal'}
                      </Badge>
                      <span className="font-semibold text-slate-700">{formatCurrency(item.amount)}</span>
                    </div>
                    {item.notes && <div className="text-[11px] text-slate-400 mt-0.5">{item.notes}</div>}
                  </div>
                  <span className="text-slate-400 text-[11px]">{formatDate(item.entryDate)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
