import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';
import { isRevenueCatConfigured } from '@/lib/revenuecat';

const ENTITLEMENT_KEY = ['revenuecat', 'entitlement'];

function isPro(info: CustomerInfo): boolean {
  return typeof info.entitlements.active[config.revenueCatEntitlement] !== 'undefined';
}

async function fetchEntitlement(): Promise<boolean> {
  if (!hasRevenueCat || !isRevenueCatConfigured()) return false;
  const info = await Purchases.getCustomerInfo();
  return isPro(info);
}

export function useEntitlement() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasRevenueCat) return;
    const listener = (info: CustomerInfo) => {
      queryClient.setQueryData(ENTITLEMENT_KEY, isPro(info));
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [queryClient]);

  const query = useQuery({ queryKey: ENTITLEMENT_KEY, queryFn: fetchEntitlement });

  return { isPro: query.data ?? false, isLoading: query.isLoading };
}
