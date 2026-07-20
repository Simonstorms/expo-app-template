import { type Href, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { hasSupabase } from '@/constants/config';
import { useSession } from '@/features/auth/hooks/use-session';
import { getOnboardingComplete } from '@/lib/storage';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors } from '@/constants/theme';
import { brand } from '@/constants/brand';
import { useFlow } from '../hooks/use-flow';

const enter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.94 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.out(Easing.ease) },
}).duration(400);

export default function SplashScreen() {
  const flow = useFlow('index');
  const router = useRouter();
  const { isSignedIn, isLoading: sessionLoading } = useSession();
  const navigated = useRef(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    getOnboardingComplete()
      .then(setOnboardingDone)
      .catch(() => setOnboardingDone(false));
    const timer = setTimeout(() => setDelayDone(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigated.current || !delayDone || onboardingDone === null) return;
    if (!onboardingDone) {
      navigated.current = true;
      router.replace('/welcome' as Href);
      return;
    }
    if (sessionLoading) return;
    navigated.current = true;
    const target: string = hasSupabase && !isSignedIn ? '/sign-in' : '/home';
    router.replace(target as Href);
  }, [router, delayDone, onboardingDone, sessionLoading, isSignedIn]);

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.center}>
        <Animated.View entering={enter} style={styles.row}>
          <Icon name="leaf.fill" size={46} color={colors.ctaFill} style={styles.leaf} />
          <Text style={styles.wordmark} numberOfLines={1} adjustsFontSizeToFit>
            {brand.wordmark}
          </Text>
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
    paddingHorizontal: 24,
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
    flexShrink: 1,
    fontSize: 58,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: colors.ctaFill,
  },
});
