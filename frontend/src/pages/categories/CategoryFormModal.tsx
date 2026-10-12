import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { categoryService } from '../../services/categoryService';
import { availableCategoryIcons, getCategoryIcon } from '../../utils/icons';
import type { Category, TransactionType } from '../../types';
import toast from 'react-hot-toast';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
  icon: z.string().min(1, 'Please choose an icon'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color code'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Category | null;
  defaultType?: TransactionType;
}

const colorPresets = [
  '#F97316', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6',
  '#EAB308', '#EF4444', '#6366F1', '#A855F7', '#06B6D4',
  '#F43F5E', '#14B8A6', '#64748B', '#0EA5E9',
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData,
  defaultType = 'EXPENSE',
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: defaultType,
      icon: 'Tag',
      color: '#6366F1',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          type: initialData.type,
          icon: initialData.icon,
          color: initialData.color || '#6366F1',
        });
      } else {
        reset({
          name: '',
          type: defaultType,
          icon: 'ShoppingBag',
          color: '#6366F1',
        });
      }
    }
  }, [isOpen, initialData, defaultType, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (initialData) {
        await categoryService.updateCategory(initialData.id, values);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(values);
        toast.success('Custom category created');
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save category';
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Category' : 'Create Custom Category'}
      subtitle="Add personalized categories to organize your transactions"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <Input
          label="Category Name *"
          placeholder="e.g. Pet Care, Gym & Fitness"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Type */}
        <Select label="Transaction Type *" error={errors.type?.message} {...register('type')}>
          <option value="EXPENSE">Expense Category</option>
          <option value="INCOME">Income Category</option>
        </Select>

        {/* Icon Picker Grid */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Select Icon *
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
            {availableCategoryIcons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setValue('icon', ic)}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  selectedIcon === ic
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCategoryIcon(ic, { className: 'w-4 h-4' })}
              </button>
            ))}
          </div>
          {errors.icon && <p className="text-xs text-rose-600">{errors.icon.message}</p>}
        </div>

        {/* Color Palette Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Color Accent *
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {colorPresets.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setValue('color', hex)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  selectedColor === hex ? 'scale-125 ring-2 ring-brand-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          {errors.color && <p className="text-xs text-rose-600">{errors.color.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
