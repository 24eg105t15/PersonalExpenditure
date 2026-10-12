import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue('email', 'demo@spendwise.com');
    setValue('password', 'Demo@123');
    toast('Demo credentials applied!', { icon: '✨' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white shadow-lg shadow-brand-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">SpendWise</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-600">
          Or{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
            create a new personal account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mb-6 p-3.5 bg-brand-50/70 border border-brand-200/70 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-brand-900">Technical Demo Account</p>
              <p className="text-brand-700 text-[11px]">Pre-populated with multi-month data</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemo}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-600" />}
              className="bg-white text-brand-700 hover:bg-brand-50 text-xs border-brand-300"
            >
              Fill Demo
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-600">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
