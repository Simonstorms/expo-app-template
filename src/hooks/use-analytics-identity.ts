import { useEffect, useRef } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { identifyUser, resetUser } from '@/lib/analytics';
import { syncPosthogUserToRevenueCat } from '@/lib/revenuecat';

export function useAnalyticsIdentity(): void {
  const { user, isLoading } = useSession();
  const lastSignedInId = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (user?.id) {
      lastSignedInId.current = user.id;
      identifyUser(user.id, user.email ? { email: user.email } : undefined);
      syncPosthogUserToRevenueCat();
    } else if (lastSignedInId.current) {
      lastSignedInId.current = null;
      resetUser();
      syncPosthogUserToRevenueCat();
    }
  }, [user?.id, user?.email, isLoading]);
}
