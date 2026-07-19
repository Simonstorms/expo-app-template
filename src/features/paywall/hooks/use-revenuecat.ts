import { useEffect } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { configureRevenueCat, identifyRevenueCatUser, resetRevenueCatUser } from '@/lib/revenuecat';

export function useRevenueCatSync(): void {
  const { user } = useSession();

  useEffect(() => {
    configureRevenueCat();
  }, []);

  useEffect(() => {
    if (user?.id) {
      void identifyRevenueCatUser(user.id);
    } else {
      void resetRevenueCatUser();
    }
  }, [user?.id]);
}
