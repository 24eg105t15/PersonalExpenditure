import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { savingsService } from '../../services/savingsService';
import type { SavingsGoal } from '../../types';
import toast from 'react-hot-toast';

const goalSchema = z.object({
  name: z.string().min(2, 'Goal name must be at least 2 characters').max(100),
  description: z.string().max(255).optional(),
  targetAmount: z.coerce.number().positive('Target amount must be greater than zero'),
  initialAmount: z.coerce.number().min(0, 'Initial deposit cannot be negative').optional(),
  targetDate: z.string().min(1, 'Target date is required'),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface SavingsGoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: SavingsGoal | null;
}

export const SavingsGoalFormModal: React.FC<SavingsGoalFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      description: '',
      targetAmount: undefined,
      initialAmount: 0,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || '',
          targetAmount: initialData.targetAmount,
          initialAmount: 0,
          targetDate: initialData.targetDate,
        });
      } else {
        reset({
          name: '',
          description: '',
          targetAmount: undefined,
          initialAmount: 0,
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (values: GoalFormValues) => {
    try {
      if (initialData) {
        await savingsService.updateGoal(initialData.id, values as any);
        toast.success('Savings goal updated');
      } else {
        await savingsService.createGoal(values as any);
        toast.success('Savings goal created');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save savings goal';
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
      subtitle="Track your progress towards future financial aspirations"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Goal Name *"
          placeholder="e.g. Emergency Fund, Japan Vacation, MacBook Pro"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Description (Optional)"
          placeholder="e.g. 6 months living expenses"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Target Amount (INR ₹) *"
            type="number"
            step="0.01"
            placeholder="e.g. 150000.00"
            error={errors.targetAmount?.message}
            {...register('targetAmount')}
          />

          {!initialData && (
            <Input
              label="Initial Deposit (₹)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.initialAmount?.message}
              {...register('initialAmount')}
            />
          )}

          <div className={initialData ? 'sm:col-span-2' : ''}>
            <Input
              label="Target Completion Date *"
              type="date"
              error={errors.targetDate?.message}
              {...register('targetDate')}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
