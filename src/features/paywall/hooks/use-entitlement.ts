import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Purchases from 'react-native-purchases';
import type { CustomerInfo } from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';
import { isRevenueCatConfigured } from '@/lib/revenuecat';
import { getLastKnownEntitlement, setLastKnownEntitlement } from '@/lib/storage';
import { runInBackground } from '@/lib/tasks';

const ENTITLEMENT_KEY = ['revenuecat', 'entitlement'];

function isPro(info: CustomerInfo): boolean {
  return info.entitlements.active[config.revenueCatEntitlement] !== undefined;
}

function remember(pro: boolean): boolean {
  void runInBackground(setLastKnownEntitlement(pro));
  return pro;
}

async function fetchEntitlement(): Promise<boolean> {
  if (!hasRevenueCat || !isRevenueCatConfigured()) {
    return false;
  }
  try {
    const info = await Purchases.getCustomerInfo();
    return remember(isPro(info));
  } catch {
    return await getLastKnownEntitlement();
  }
}

function subscribeToCustomerInfo(queryClient: QueryClient): () => void {
  const listener = (info: CustomerInfo) => {
    queryClient.setQueryData(ENTITLEMENT_KEY, remember(isPro(info)));
  };
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export function useEntitlement() {
  const queryClient = useQueryClient();

  useEffect(
    () => (hasRevenueCat ? subscribeToCustomerInfo(queryClient) : undefined),
    [queryClient],
  );

  const query = useQuery({
    queryKey: ENTITLEMENT_KEY,
    queryFn: fetchEntitlement,
    gcTime: Infinity,
    initialData: hasRevenueCat ? undefined : false,
  });

  return { isPro: query.data ?? false, isLoading: query.isLoading };
}
