import { usePlacement } from 'expo-superwall';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryCTA } from '@/components/ui/primary-cta';
import { ScreenBackground } from '@/components/ui/screen-background';
import { content } from '@/constants/content';
import { colors, layout } from '@/constants/theme';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { paywallPlacement } from '@/lib/superwall';
import { restorePurchases } from '../api';
import { useEntitlement } from '../hooks/use-entitlement';

export default function SuperwallPaywallScreen() {
  const { finish } = useFlow('paywall');
  const { isPro } = useEntitlement();
  const insets = useSafeAreaInsets();
  const completed = useRef(false);
  const started = useRef(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const complete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    void finish();
  }, [finish]);

  const { registerPlacement } = usePlacement({
    onError: () => setError(true),
  });

  const present = useCallback(() => {
    setError(false);
    registerPlacement({
      placement: paywallPlacement,
      feature: () => complete(),
    }).catch(() => setError(true));
  }, [registerPlacement, complete]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    present();
  }, [present]);

  useEffect(() => {
    if (isPro) complete();
  }, [isPro, complete]);

  const onRestore = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const pro = await restorePurchases();
      if (pro) complete();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }, [busy, complete]);

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16 },
        ]}>
        <View style={styles.restoreRow}>
          <Pressable onPress={onRestore} disabled={busy} hitSlop={12}>
            <Text style={styles.restoreText}>{content.paywall.restore}</Text>
          </Pressable>
        </View>
        <View style={styles.center}>
          <Text style={styles.headline}>{content.paywall.headline}</Text>
          {error ? <Text style={styles.error}>{content.paywall.error}</Text> : null}
        </View>
        <View style={styles.footer}>
          <PrimaryCTA title={content.paywall.continue} onPress={present} />
          <Text style={styles.priceCaption}>{content.paywall.priceCaption}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.ctaMargin,
  },
  restoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  restoreText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: colors.ink,
    paddingHorizontal: 24,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.orange,
    textAlign: 'center',
  },
  footer: {
    gap: 14,
  },
  priceCaption: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});
