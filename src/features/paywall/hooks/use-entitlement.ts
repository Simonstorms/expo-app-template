import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';
import { isRevenueCatConfigured } from '@/lib/revenuecat';
import { getLastKnownEntitlement, setLastKnownEntitlement } from '@/lib/storage';

const ENTITLEMENT_KEY = ['revenuecat', 'entitlement'];

function isPro(info: CustomerInfo): boolean {
  return typeof info.entitlements.active[config.revenueCatEntitlement] !== 'undefined';
}

function remember(pro: boolean): boolean {
  void setLastKnownEntitlement(pro).catch(() => undefined);
  return pro;
}

async function fetchEntitlement(): Promise<boolean> {
  if (!hasRevenueCat || !isRevenueCatConfigured()) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return remember(isPro(info));
  } catch {
    return getLastKnownEntitlement();
  }
}

export function useEntitlement() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasRevenueCat) return;
    const listener = (info: CustomerInfo) => {
      queryClient.setQueryData(ENTITLEMENT_KEY, remember(isPro(info)));
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: ENTITLEMENT_KEY,
    queryFn: fetchEntitlement,
    gcTime: Infinity,
    initialData: hasRevenueCat ? undefined : false,
  });

  return { isPro: query.data ?? false, isLoading: query.isLoading };
}
