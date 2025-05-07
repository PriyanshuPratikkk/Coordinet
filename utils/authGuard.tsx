'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/localStorage';

/**
 * Higher order component for client-side route protection
 * @param WrappedComponent - Component to wrap
 * @param allowedRoles - Array of roles allowed to access the component
 * @returns The protected component
 */
export function withAuthGuard<T extends React.PropsWithChildren<{}>>(
  WrappedComponent: React.ComponentType<T>,
  allowedRoles: ('club_leader' | 'student')[]
) {
  return function ProtectedRoute(props: T) {
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
      const session = getSession();
      
      // If no session, redirect to sign in
      if (!session) {
        router.replace('/auth/signin');
        return;
      }
      
      // If role not allowed, redirect to appropriate dashboard
      if (!allowedRoles.includes(session.role)) {
        const redirectPath = session.role === 'club_leader' 
          ? '/dashboard/leader' 
          : '/dashboard/student';
        
        // Prevent redirect loops
        if (pathname !== redirectPath) {
          router.replace(redirectPath);
        }
      }
    }, [router, pathname]);
    
    return <WrappedComponent {...props} />;
  };
}

/**
 * Hook for client-side route protection
 * @param allowedRoles - Array of roles allowed to access the route
 * @returns Object with loading state
 */
export function useAuthGuard(allowedRoles: ('club_leader' | 'student')[]) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const session = getSession();
    
    if (!session) {
      router.replace('/auth/signin');
      return;
    }
    
    if (!allowedRoles.includes(session.role)) {
      const redirectPath = session.role === 'club_leader' 
        ? '/dashboard/leader' 
        : '/dashboard/student';
      
      if (pathname !== redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [router, pathname, allowedRoles]);
  
  return { isLoading: false };
}