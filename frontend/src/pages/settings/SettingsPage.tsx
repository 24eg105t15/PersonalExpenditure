import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { profileService } from '../../services/profileService';
import { Settings, Bell, Globe, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsFormValues {
  currency: string;
  dateFormat: string;
  theme: string;
  monthlyBudgetAlert: boolean;
}

export const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<SettingsFormValues>({
    defaultValues: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      monthlyBudgetAlert: true,
    },
  });

  useEffect(() => {
    profileService
      .getSettings()
      .then((data) => {
        reset({
          currency: data.currency,
          dateFormat: data.dateFormat,
          theme: data.theme,
          monthlyBudgetAlert: data.monthlyBudgetAlert,
        });
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
      await profileService.updateSettings(values);
      toast.success('Preferences saved successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Preferences & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure default currencies, regional formats, and notification alerts
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Regional & Financial Settings */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-600" /> Regional Preferences
              </div>
            }
            subtitle="Display currency and date representation"
          />
          <div className="space-y-4">
            <Select label="Preferred Currency" {...register('currency')}>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </Select>

            <Select label="Date Format" {...register('dateFormat')}>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 12/10/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/12/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-12)</option>
            </Select>
          </div>
        </Card>

        {/* Alerts & Thresholds */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" /> Notifications & Alerts
              </div>
            }
            subtitle="Automated warnings when approaching budget limits"
          />
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                {...register('monthlyBudgetAlert')}
              />
              <div>
                <span className="text-sm font-semibold text-slate-800">
                  Monthly Budget Warning Indicators
                </span>
                <p className="text-xs text-slate-500">
                  Highlight categories with amber or red warning badges when spending approaches 80% or exceeds planned limit.
                </p>
              </div>
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
