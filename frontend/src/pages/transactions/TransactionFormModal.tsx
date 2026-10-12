import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { categoryService } from '../../services/categoryService';
import { transactionService } from '../../services/transactionService';
import type { Category, Transaction, TransactionType } from '../../types';
import toast from 'react-hot-toast';

const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  description: z.string().min(2, 'Description must be at least 2 characters').max(255),
  categoryId: z.coerce.number().positive('Please select a category'),
  transactionDate: z.string().min(1, 'Date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Transaction | null;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: undefined,
      description: '',
      categoryId: 0,
      transactionDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'UPI',
      notes: '',
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          type: initialData.type,
          amount: initialData.amount,
          description: initialData.description,
          categoryId: initialData.categoryId,
          transactionDate: initialData.transactionDate,
          paymentMethod: initialData.paymentMethod,
          notes: initialData.notes || '',
        });
      } else {
        reset({
          type: 'EXPENSE',
          amount: undefined,
          description: '',
          categoryId: 0,
          transactionDate: new Date().toISOString().slice(0, 10),
          paymentMethod: 'UPI',
          notes: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingCategories(true);
      categoryService
        .getCategories(selectedType)
        .then((cats) => {
          setCategories(cats);
          if (cats.length > 0 && (!initialData || initialData.type !== selectedType)) {
            setValue('categoryId', cats[0].id);
          }
        })
        .catch(() => toast.error('Failed to load categories'))
        .finally(() => setIsLoadingCategories(false));
    }
  }, [isOpen, selectedType, setValue, initialData]);

  const onSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await transactionService.updateTransaction(initialData.id, values);
        toast.success('Transaction updated successfully');
      } else {
        await transactionService.createTransaction(values);
        toast.success('Transaction recorded successfully');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save transaction';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      subtitle={initialData ? 'Update transaction details' : 'Track your personal income or expense'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type selector toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setValue('type', 'EXPENSE')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedType === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'INCOME')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedType === 'INCOME'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Income (+)
          </button>
        </div>

        {/* Amount */}
        <Input
          label="Amount (INR ₹) *"
          type="number"
          step="0.01"
          placeholder="e.g. 1500.00"
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Description */}
        <Input
          label="Description *"
          placeholder="e.g. Supermarket Groceries"
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category *"
            error={errors.categoryId?.message}
            disabled={isLoadingCategories}
            {...register('categoryId')}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Input
            label="Date *"
            type="date"
            error={errors.transactionDate?.message}
            {...register('transactionDate')}
          />
        </div>

        {/* Payment Method */}
        <Select
          label="Payment Method *"
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        >
          <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
          <option value="Cash">Cash</option>
          <option value="Other">Other</option>
        </Select>

        {/* Optional Notes */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add any extra reference notes..."
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            {...register('notes')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Record Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
