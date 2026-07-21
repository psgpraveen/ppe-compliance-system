'use client';

import { ViolationList } from '@/features/violations/components/ViolationList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
      <ViolationList />
    </ProtectedRoute>
  );
}
