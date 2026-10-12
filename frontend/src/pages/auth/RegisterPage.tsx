import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms of service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser(values.fullName, values.email, values.password, values.confirmPassword);
      toast.success('Account created successfully! Welcome to SpendWise.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name *"
              placeholder="e.g. John Doe"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email address *"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
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

            <Input
              label="Confirm Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="space-y-1">
              <label className="flex items-start text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  {...register('terms')}
                />
                <span className="ml-2">
                  I accept the{' '}
                  <span className="text-brand-600 underline">Terms of Service</span> and{' '}
                  <span className="text-brand-600 underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-rose-600">{errors.terms.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
