import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

export default function NotificationsScreen() {
  const { advance } = useFlow('notifications');
  const fingerRaised = useSharedValue(0);

  useEffect(() => {
    fingerRaised.value = withRepeat(
      withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [fingerRaised]);

  const fingerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 79 }, { translateY: -5 * fingerRaised.value }],
  }));

  const requestPermission = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {}
    advance();
  };

  return (
    <OnboardingScaffold step="notifications" ctaTitle={null}>
      <View style={styles.container}>
        <View style={styles.spacer} />
        <Text style={styles.title}>{'Reach your goals with\nnotifications'}</Text>
        <AlertCard onDismiss={advance} onAllow={requestPermission} />
        <Animated.Text style={[styles.finger, fingerStyle]}>{'👆'}</Animated.Text>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function AlertCard({ onDismiss, onAllow }: { onDismiss: () => void; onAllow: () => void }) {
  return (
    <GlassSurface radius={14} tintColor={withAlpha('#C6C6C6', 0.85)} isInteractive style={styles.card}>
      <View style={styles.promptTextWrap}>
        <Text style={styles.promptText}>{'Quit Snus would like to send you\nNotifications'}</Text>
      </View>
      <View style={styles.buttonsRow}>
        <View style={styles.dismissColumn}>
          <View style={styles.divider} />
          <Pressable style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissLabel}>{'Don’t Allow'}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.allowButton} onPress={onAllow}>
          <Text style={styles.allowLabel}>Allow</Text>
        </Pressable>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.ink,
    textAlign: 'center',
  },
  card: {
    width: 314.7,
    height: 143,
    marginTop: 31,
    borderRadius: 14,
    overflow: 'hidden',
  },
  promptTextWrap: {
    width: '100%',
    height: 92.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 21.5,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  dismissColumn: {
    width: 158.7,
  },
  divider: {
    height: 0.7,
    backgroundColor: '#A9A9A9',
  },
  dismissButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: '#1C1B21',
  },
  allowButton: {
    width: 156,
    height: 50.7,
    backgroundColor: colors.ctaFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.white,
  },
  finger: {
    fontSize: 32,
    marginTop: 18,
  },
});
