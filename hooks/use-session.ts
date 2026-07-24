'use client';

import { useSession as useBetterSession } from '@/lib/auth-client';
import type { UserRole } from '@/types';

/**
 * Hook to access the current user session
 * Under the hood, this wraps Better Auth's hook for clean compatibility
 */
export function useSession() {
  const { data, isPending } = useBetterSession();

  const session = data
    ? {
        userId: data.user.id,
        email: data.user.email,
        role: (data.user as any).role as UserRole || 'worker',
        expiresAt: new Date(data.session.expiresAt),
      }
    : null;

  return { session, isLoading: isPending };
}
