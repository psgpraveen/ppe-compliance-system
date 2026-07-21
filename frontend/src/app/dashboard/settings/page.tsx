'use client';

import { SettingsPage } from '@/features/settings/components/SettingsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <SettingsPage />
    </ProtectedRoute>
  );
}
