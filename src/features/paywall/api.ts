import Purchases from 'react-native-purchases';

import { hasRevenueCat } from '@/constants/config';

export async function restorePurchases(): Promise<void> {
  if (!hasRevenueCat) return;
  await Purchases.restorePurchases();
}
