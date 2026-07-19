import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { getOnboardingComplete } from '@/lib/storage';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

const enter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.94 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.out(Easing.ease) },
}).duration(400);

export default function SplashScreen() {
  const { advance } = useFlow('index');
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const done = await getOnboardingComplete();
      if (cancelled) return;
      if (done) {
        const home: string = '/home';
        router.replace(home as Href);
      } else {
        advance();
      }
    }, 1400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [advance, router]);

  return (
    <OnboardingScaffold step="index" ctaTitle={null}>
      <View style={styles.center}>
        <Animated.View entering={enter} style={styles.row}>
          <Icon name="leaf.fill" size={46} color={colors.ctaFill} style={styles.leaf} />
          <Text style={styles.wordmark}>Quit Snus</Text>
        </Animated.View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 13,
  },
  leaf: {
    marginBottom: 8,
  },
  wordmark: {
    fontSize: 58,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.ctaFill,
  },
});
