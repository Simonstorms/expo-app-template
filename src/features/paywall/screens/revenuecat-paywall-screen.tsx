import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { CustomerInfo } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

import { config } from '@/constants/config';
import { useFlow } from '@/features/onboarding/hooks/use-flow';

import { useEntitlement } from '../hooks/use-entitlement';

function hasEntitlement(info: CustomerInfo): boolean {
  return info.entitlements.active[config.revenueCatEntitlement] !== undefined;
}

export default function RevenueCatPaywallScreen() {
  const { finish } = useFlow('paywall');
  const { isPro } = useEntitlement();
  const completed = useRef(false);

  const complete = () => {
    if (completed.current) {
      return;
    }
    completed.current = true;
    void finish();
  };

  useEffect(() => {
    if (!isPro || completed.current) {
      return;
    }
    completed.current = true;
    void finish();
  }, [isPro, finish]);

  return (
    <View style={styles.root}>
      <RevenueCatUI.Paywall
        style={styles.paywall}
        onPurchaseCompleted={({ customerInfo }) => {
          if (hasEntitlement(customerInfo)) {
            complete();
          }
        }}
        onRestoreCompleted={({ customerInfo }) => {
          if (hasEntitlement(customerInfo)) {
            complete();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paywall: {
    flex: 1,
  },
});
