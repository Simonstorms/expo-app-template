import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { hasRevenueCat } from '@/constants/config';
import { captureEvent } from '@/lib/analytics';

import PaywallScreen, { type PaywallEntry } from './paywall-screen';
import RevenueCatPaywallScreen from './revenuecat-paywall-screen';

const USE_REVENUECAT_HOSTED_PAYWALL = false;

function entryOf(context: string | undefined): PaywallEntry {
  if (context === 'gate') return 'gate';
  if (context === 'upsell' || context === 'home') return 'upsell';
  return 'onboarding';
}

export default function PaywallRoute() {
  const { context } = useLocalSearchParams<{ context?: string }>();
  const entry = entryOf(context);

  useEffect(() => {
    captureEvent('paywall_viewed', { context: entry });
  }, [entry]);

  if (USE_REVENUECAT_HOSTED_PAYWALL && hasRevenueCat) return <RevenueCatPaywallScreen />;

  return <PaywallScreen entry={entry} />;
}
