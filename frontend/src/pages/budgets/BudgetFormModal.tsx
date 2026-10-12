import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';
import type { Budget, Category } from '../../types';
import toast from 'react-hot-toast';

const budgetSchema = z.object({
  categoryId: z.coerce.number().positive('Please select an expense category'),
  amount: z.coerce.number().positive('Budget amount must be greater than zero'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  warningThreshold: z.coerce.number().min(1).max(100),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Budget | null;
  defaultMonth: number;
  defaultYear: number;
}

export const BudgetFormModal: React.FC<BudgetFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
  defaultMonth,
  defaultYear,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: 0,
      amount: undefined,
      month: defaultMonth,
      year: defaultYear,
      warningThreshold: 80,
    },
  });

  useEffect(() => {
    if (isOpen) {
      categoryService.getCategories('EXPENSE').then(setCategories).catch(() => {});
      if (initialData) {
        reset({
          categoryId: initialData.categoryId,
          amount: initialData.amount,
          month: initialData.month,
          year: initialData.year,
          warningThreshold: initialData.warningThreshold,
        });
      } else {
        reset({
          categoryId: 0,
          amount: undefined,
          month: defaultMonth,
          year: defaultYear,
          warningThreshold: 80,
        });
      }
    }
  }, [isOpen, initialData, defaultMonth, defaultYear, reset]);

  const onSubmit = async (values: BudgetFormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await budgetService.updateBudget(initialData.id, values);
        toast.success('Budget updated successfully');
      } else {
        await budgetService.createBudget(values);
        toast.success('Budget created successfully');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget' : 'Set Monthly Budget'}
      subtitle="Define category spending limits and warning alerts"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category */}
        <Select
          label="Expense Category *"
          error={errors.categoryId?.message}
          {...register('categoryId')}
        >
          <option value="">Select Category...</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        {/* Budget Amount */}
        <Input
          label="Budget Amount (INR ₹) *"
          type="number"
          step="0.01"
          placeholder="e.g. 15000.00"
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Period Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Select label="Month *" error={errors.month?.message} {...register('month')}>
            {[
              { val: 1, name: 'January' },
              { val: 2, name: 'February' },
              { val: 3, name: 'March' },
              { val: 4, name: 'April' },
              { val: 5, name: 'May' },
              { val: 6, name: 'June' },
              { val: 7, name: 'July' },
              { val: 8, name: 'August' },
              { val: 9, name: 'September' },
              { val: 10, name: 'October' },
              { val: 11, name: 'November' },
              { val: 12, name: 'December' },
            ].map((m) => (
              <option key={m.val} value={m.val}>
                {m.name}
              </option>
            ))}
          </Select>

          <Input
            label="Year *"
            type="number"
            error={errors.year?.message}
            {...register('year')}
          />
        </div>

        {/* Warning Threshold */}
        <Select
          label="Alert Threshold (%) *"
          helperText="Receive an amber warning indicator when utilization passes this %"
          error={errors.warningThreshold?.message}
          {...register('warningThreshold')}
        >
          <option value="75">75% (Early Alert)</option>
          <option value="80">80% (Standard)</option>
          <option value="85">85% (Cautious)</option>
          <option value="90">90% (Near Limit)</option>
          <option value="95">95% (Critical)</option>
        </Select>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Update Budget' : 'Set Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
