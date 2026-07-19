import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';

let configured = false;

export function isRevenueCatConfigured(): boolean {
  return configured;
}

export function configureRevenueCat(): void {
  if (!hasRevenueCat || configured) return;
  const apiKey = Platform.OS === 'ios' ? config.revenueCatIosKey : config.revenueCatAndroidKey;
  if (!apiKey) return;
  Purchases.configure({ apiKey });
  configured = true;
}

export async function identifyRevenueCatUser(userId: string): Promise<void> {
  if (!configured) return;
  await Purchases.logIn(userId);
}

export async function resetRevenueCatUser(): Promise<void> {
  if (!configured) return;
  await Purchases.logOut();
}
