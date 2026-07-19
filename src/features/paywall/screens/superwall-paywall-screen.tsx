import { usePlacement } from 'expo-superwall';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { paywallPlacement } from '@/lib/superwall';

export default function SuperwallPaywallScreen() {
  const { finish } = useFlow('paywall');
  const completed = useRef(false);
  const started = useRef(false);

  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    void finish();
  }, [finish]);

  const { registerPlacement } = usePlacement({
    onDismiss: () => complete(),
    onError: () => complete(),
  });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void registerPlacement({
      placement: paywallPlacement,
      feature: () => complete(),
    });
  }, [registerPlacement, complete]);

  return <View style={styles.root} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
