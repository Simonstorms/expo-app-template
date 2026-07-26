import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { hasRevenueCat } from '@/constants/config';
import { captureEvent } from '@/lib/analytics';

import PaywallScreen from './paywall-screen';
import RevenueCatPaywallScreen from './revenuecat-paywall-screen';

const USE_REVENUECAT_HOSTED_PAYWALL = false;

export default function PaywallRoute() {
  const { context } = useLocalSearchParams<{ context?: string }>();
  const placement = context === 'home' ? 'home' : 'onboarding';

  useEffect(() => {
    captureEvent('paywall_viewed', { context: placement });
  }, [placement]);

  if (USE_REVENUECAT_HOSTED_PAYWALL && hasRevenueCat) return <RevenueCatPaywallScreen />;

  return <PaywallScreen fromHome={placement === 'home'} />;
}
