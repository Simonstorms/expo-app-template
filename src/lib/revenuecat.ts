import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';

import { config, hasRevenueCat } from '@/constants/config';
import { analyticsDistinctId } from '@/lib/analytics';
import { clearLastKnownEntitlement } from '@/lib/storage';
import { attempt, runInBackground } from '@/lib/tasks';

let configured = false;

export function isRevenueCatConfigured(): boolean {
  return configured;
}

export function syncPosthogUserToRevenueCat(): void {
  if (!configured) {
    return;
  }
  const distinctId = analyticsDistinctId();
  if (!distinctId) {
    return;
  }
  void runInBackground(Purchases.setAttributes({ $posthogUserId: distinctId }));
}

export function configureRevenueCat(): void {
  if (!hasRevenueCat || configured) {
    return;
  }
  const apiKey = Platform.OS === 'ios' ? config.revenueCatIosKey : config.revenueCatAndroidKey;
  if (!apiKey) {
    return;
  }
  Purchases.configure({ apiKey });
  configured = true;
  syncPosthogUserToRevenueCat();
}

export async function identifyRevenueCatUser(userId: string): Promise<void> {
  if (!configured) {
    return;
  }
  await Purchases.logIn(userId);
  syncPosthogUserToRevenueCat();
}

export async function resetRevenueCatUser(): Promise<void> {
  if (!configured) {
    return;
  }
  await attempt(clearLastKnownEntitlement());
  const anonymous = await Purchases.isAnonymous();
  if (anonymous) {
    return;
  }
  await Purchases.logOut();
  syncPosthogUserToRevenueCat();
}
