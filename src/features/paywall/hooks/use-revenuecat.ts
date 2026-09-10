import { useEffect, useRef } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { configureRevenueCat, identifyRevenueCatUser, resetRevenueCatUser } from '@/lib/revenuecat';

export function useRevenueCatSync(): void {
  const { user, isLoading } = useSession();
  const lastSignedInId = useRef<string | null>(null);

  useEffect(() => {
    configureRevenueCat();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user?.id) {
      lastSignedInId.current = user.id;
      void identifyRevenueCatUser(user.id);
    } else if (lastSignedInId.current) {
      lastSignedInId.current = null;
      void resetRevenueCatUser();
    }
  }, [user?.id, isLoading]);
}
