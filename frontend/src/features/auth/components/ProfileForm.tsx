'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  UpdateProfileFormData, 
  updateProfileSchema, 
  ChangePasswordFormData, 
  changePasswordSchema 
} from '../validation';
import { useUser, useUpdateProfile, useChangePassword } from '../hooks/useAuth';
import { User, Lock, KeyRound, Save, ShieldCheck, Mail, Building2, Network, MapPin, BadgeCheck } from 'lucide-react';

export const ProfileForm = () => {
  const { data: user, isLoading } = useUser();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Populate profile form when user data is loaded
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = (data: UpdateProfileFormData) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        resetPassword({ oldPassword: '', newPassword: '' });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isSupervisor = user?.role === 'SUPERVISOR';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Top Header Banner Card ──────────────────────────────── */}
      <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0 ring-4 ring-blue-50">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user?.firstName} {user?.lastName}</h2>
              <BadgeCheck className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            {user?.role} ACCOUNT
          </span>
        </div>
      </div>

      {/* ── Managed Department & Scope Summary Card ────────────── */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-blue-200 backdrop-blur-sm">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Assigned Department & Work Scope</h3>
              <p className="text-xs text-blue-200">Official workplace assignment details</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/10">
            {isSupervisor ? 'Supervisor Scope' : 'System Wide'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
              <Network className="w-4 h-4" /> Department
            </div>
            <p className="text-base font-bold text-white truncate">{user?.departmentName || 'Not Assigned'}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
              <Building2 className="w-4 h-4" /> Assigned Site
            </div>
            <p className="text-base font-bold text-white truncate">{user?.siteName || 'All Sites'}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
              <MapPin className="w-4 h-4" /> Location / Region
            </div>
            <p className="text-base font-bold text-white truncate">{user?.siteLocation || 'HQ / Central'}</p>
          </div>
        </div>
      </div>

      {/* ── Edit Details & Security Forms Grid ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Personal Details</h3>
              <p className="text-xs text-gray-500">Update your account name and email address</p>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                {...registerProfile('firstName')}
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
              {profileErrors.firstName && (
                <p className="mt-1 text-xs text-red-600">{profileErrors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                {...registerProfile('lastName')}
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
              {profileErrors.lastName && (
                <p className="mt-1 text-xs text-red-600">{profileErrors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                {...registerProfile('email')}
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
              {profileErrors.email && (
                <p className="mt-1 text-xs text-red-600">{profileErrors.email.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition"
              >
                <Save className="w-4 h-4" />
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Security & Password</h3>
              <p className="text-xs text-gray-500">Change your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                {...registerPassword('oldPassword')}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
              {passwordErrors.oldPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordErrors.oldPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition"
              >
                <Lock className="w-4 h-4" />
                {isChangingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
