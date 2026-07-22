'use client';

import { useUser } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { DashboardSkeleton } from '@/components/ui/DashboardSkeleton';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push('/login');
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
