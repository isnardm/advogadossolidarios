"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'USUARIO' | 'ADVOGADO';

interface UseAuthRedirectOptions {
  requiredAuth: boolean;
  allowedRoles?: Role[];
  redirectPath?: string;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions) => {
  const { requiredAuth, allowedRoles, redirectPath = '/login' } = options;
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't redirect until auth state is loaded

    if (requiredAuth && !isAuthenticated) {
      router.replace(redirectPath);
      return;
    }

    if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/dashboard'); // Or a specific "access denied" page
      return;
    }

    // Optional: Redirect authenticated users away from public pages like login/register
    if (!requiredAuth && isAuthenticated && (router.pathname === '/login' || router.pathname === '/register/user' || router.pathname === '/register/lawyer')) {
        router.replace('/dashboard');
    }

  }, [isAuthenticated, user, isLoading, requiredAuth, allowedRoles, redirectPath, router]);

  return { isLoading, isAuthenticated, user };
};
