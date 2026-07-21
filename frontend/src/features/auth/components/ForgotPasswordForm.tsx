'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../validation';
import { useForgotPassword } from '../hooks/useAuth';
import Link from 'next/link';

export const ForgotPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your email to receive a reset link</p>
      </div>

      {isSuccess ? (
        <div className="rounded-md bg-green-50 p-4 mt-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Email sent</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>If an account exists with that email, we sent a password reset link. Please check your inbox.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200"
          >
            {isPending ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Back to Login
        </Link>
      </div>
    </div>
  );
};
