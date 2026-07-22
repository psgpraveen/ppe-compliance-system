'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';
import { LoginFormData, UpdateProfileFormData, ChangePasswordFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../validation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['user', 'me'], data.user);
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileFormData) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};
