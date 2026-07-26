import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NotificationPreview } from '@/components/ui/notification-preview';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { content } from '@/constants/content';
import { colors, font, layout } from '@/constants/theme';
import { captureEvent } from '@/lib/analytics';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { useFlow } from '../hooks/use-flow';

export default function NotificationsScreen() {
  const flow = useFlow('notifications');
  const { advance } = flow;
  const [busy, setBusy] = useState(false);

  const requestPermission = async () => {
    if (busy) return;
    setBusy(true);
    let granted = false;
    try {
      granted = (await Notifications.requestPermissionsAsync()).granted;
    } catch {
      granted = false;
    }
    captureEvent('permission_requested', {
      permission: 'notifications',
      result: granted ? 'granted' : 'denied',
      context: 'onboarding',
    });
    setBusy(false);
    advance();
  };

  const skip = () => {
    if (busy) return;
    captureEvent('permission_requested', {
      permission: 'notifications',
      result: 'skipped',
      context: 'onboarding',
    });
    advance();
  };

  const { previews } = content.notifications;

  const footer = (
    <View style={styles.footer}>
      <PrimaryCTA
        title={content.notifications.allow}
        enabled={!busy}
        onPress={() => {
          void requestPermission();
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={content.notifications.dismiss}
        disabled={busy}
        onPress={skip}
        style={({ pressed }) => [styles.skipButton, { opacity: pressed || busy ? 0.6 : 1 }]}
      >
        <Text style={styles.skipLabel}>{content.notifications.dismiss}</Text>
      </Pressable>
    </View>
  );

  return (
    <OnboardingScaffold flow={flow} footer={footer}>
      <View style={styles.container}>
        <Text style={styles.title}>{content.notifications.title}</Text>
        <Text style={styles.caption}>{content.notifications.caption}</Text>
        <View style={styles.stack}>
          <NotificationPreview
            title={previews.first.title}
            body={previews.first.body}
            time={previews.first.time}
            symbol="sparkles"
          />
          <NotificationPreview
            title={previews.second.title}
            body={previews.second.body}
            time={previews.second.time}
            symbol="clock.fill"
          />
          <NotificationPreview
            title={previews.third.title}
            body={previews.third.body}
            time={previews.third.time}
            symbol="chart.bar.fill"
          />
        </View>
        <View style={styles.grow} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.margin,
  },
  title: {
    paddingTop: 14,
    fontSize: 26,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 31,
    color: colors.ink,
    textAlign: 'center',
  },
  caption: {
    marginTop: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: font.regular,
    fontWeight: '400',
    color: colors.secondaryText,
    lineHeight: 20,
    textAlign: 'center',
  },
  stack: {
    marginTop: 24,
    gap: 10,
  },
  grow: {
    flex: 1,
    minHeight: 10,
  },
  footer: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipLabel: {
    fontSize: 15,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.secondaryText,
  },
});
