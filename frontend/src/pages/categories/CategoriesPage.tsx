import React, { useEffect, useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Lock, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { CategoryFormModal } from './CategoryFormModal';
import { categoryService } from '../../services/categoryService';
import { getCategoryIcon } from '../../utils/icons';
import type { Category, TransactionType } from '../../types';
import toast from 'react-hot-toast';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<TransactionType>('EXPENSE');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingId);
      toast.success('Category deleted');
      setDeletingId(null);
      loadCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system defaults and add custom labels for accurate financial grouping
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Custom Category
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'EXPENSE'
              ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Expense Categories ({categories.filter((c) => c.type === 'EXPENSE').length})
        </button>
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'INCOME'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Income Categories ({categories.filter((c) => c.type === 'INCOME').length})
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} hoverEffect className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                style={{ backgroundColor: category.color || '#6366f1' }}
              >
                {getCategoryIcon(category.icon, { className: 'w-5 h-5' })}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 truncate">{category.name}</h4>
                <div className="mt-1">
                  {category.isDefault ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                      <Lock className="w-2.5 h-2.5" /> System Default
                    </span>
                  ) : (
                    <Badge variant="brand" size="sm">
                      Custom
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions (Only custom categories are editable/deletable) */}
            {!category.isDefault && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingId(category.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSaved={loadCategories}
        initialData={editingCategory}
        defaultType={activeTab}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Custom Category"
        message="Are you sure you want to delete this custom category? Categories with active transactions cannot be deleted."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};
