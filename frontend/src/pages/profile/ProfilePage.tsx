import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Lock, ShieldCheck, Mail, Calendar } from 'lucide-react';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const onUpdateProfile = async (values: ProfileFormValues) => {
    setIsUpdatingProfile(true);
    try {
      await profileService.updateProfile(values);
      await refreshUser();
      toast.success('Profile details updated successfully');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onChangePassword = async (values: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      await profileService.changePassword(values);
      toast.success('Password changed successfully');
      resetPassword();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal credentials, identity, and security preferences
        </p>
      </div>

      {/* Account Info Card */}
      <Card className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" /> Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <Card>
          <CardHeader title="Personal Details" subtitle="Update your profile name and login email" />
          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            <Input
              label="Full Name *"
              leftIcon={<User className="w-4 h-4" />}
              error={profileErrors.fullName?.message}
              {...registerProfile('fullName')}
            />

            <Input
              label="Email Address *"
              type="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={profileErrors.email?.message}
              {...registerProfile('email')}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" isLoading={isUpdatingProfile}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card>
          <CardHeader title="Security & Password" subtitle="Ensure your account uses a strong password" />
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-3">
            <Input
              label="Current Password *"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />

            <Input
              label="New Password *"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />

            <Input
              label="Confirm New Password *"
              type="password"
              placeholder="Re-enter new password"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" variant="outline" isLoading={isChangingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
