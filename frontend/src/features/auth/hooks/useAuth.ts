'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';
import { LoginFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../validation';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Login successful');
      router.push('/dashboard');
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authService.getMe(),
    retry: false,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success('If your email is registered, a reset link has been sent.');
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to request password reset');
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
      router.push('/login');
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};
