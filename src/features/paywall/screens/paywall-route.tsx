import { useEffect } from 'react';

import { hasRevenueCat } from '@/constants/config';
import { captureEvent } from '@/lib/analytics';

import PaywallScreen from './paywall-screen';
import RevenueCatPaywallScreen from './revenuecat-paywall-screen';

export default function PaywallRoute() {
  useEffect(() => {
    captureEvent('paywall_viewed');
  }, []);

  return hasRevenueCat ? <RevenueCatPaywallScreen /> : <PaywallScreen />;
}
