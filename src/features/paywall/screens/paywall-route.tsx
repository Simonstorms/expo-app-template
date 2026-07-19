import { useEffect } from 'react';

import { hasSuperwall } from '@/constants/config';
import { captureEvent } from '@/lib/analytics';

import PaywallScreen from './paywall-screen';
import SuperwallPaywallScreen from './superwall-paywall-screen';

export default function PaywallRoute() {
  useEffect(() => {
    captureEvent('paywall_viewed');
  }, []);

  return hasSuperwall ? <SuperwallPaywallScreen /> : <PaywallScreen />;
}
