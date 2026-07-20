import { CustomPurchaseControllerProvider, SuperwallProvider } from 'expo-superwall';
import type { ReactNode } from 'react';

import { hasSuperwall } from '@/constants/config';
import { useSuperwallSync } from '@/features/paywall/hooks/use-superwall-sync';
import { revenueCatPurchaseController } from '@/lib/revenuecat-purchase-controller';
import { superwallApiKeys } from '@/lib/superwall';

function SuperwallSync() {
  useSuperwallSync();
  return null;
}

export function PaywallProvider({ children }: { children: ReactNode }) {
  if (!hasSuperwall) return <>{children}</>;
  return (
    <CustomPurchaseControllerProvider controller={revenueCatPurchaseController}>
      <SuperwallProvider apiKeys={superwallApiKeys}>
        <SuperwallSync />
        {children}
      </SuperwallProvider>
    </CustomPurchaseControllerProvider>
  );
}
