import type { SubscriptionStatus } from 'expo-superwall';

import { config } from '@/constants/config';

export const superwallApiKeys = {
  ios: config.superwallIosKey,
  android: config.superwallAndroidKey,
};

export const paywallPlacement = config.superwallPlacement;

export function subscriptionStatusFor(isPro: boolean): SubscriptionStatus {
  if (!isPro) return { status: 'INACTIVE' };
  return {
    status: 'ACTIVE',
    entitlements: [{ id: config.revenueCatEntitlement, type: 'SERVICE_LEVEL' }],
  };
}
