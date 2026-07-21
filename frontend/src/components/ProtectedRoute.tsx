'use client';

import { useUser } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.push('/login');
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
