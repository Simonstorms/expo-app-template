import { useUser } from 'expo-superwall';
import { useEffect } from 'react';

import { subscriptionStatusFor } from '@/lib/superwall';
import { useEntitlement } from './use-entitlement';

export function useSuperwallSync(): void {
  const { isPro, isLoading } = useEntitlement();
  const { setSubscriptionStatus } = useUser();

  useEffect(() => {
    if (isLoading) return;
    void setSubscriptionStatus(subscriptionStatusFor(isPro));
  }, [isPro, isLoading, setSubscriptionStatus]);
}
