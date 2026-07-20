import Purchases from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';

export async function restorePurchases(): Promise<boolean> {
  if (!hasRevenueCat) return false;
  const info = await Purchases.restorePurchases();
  return typeof info.entitlements.active[config.revenueCatEntitlement] !== 'undefined';
}
