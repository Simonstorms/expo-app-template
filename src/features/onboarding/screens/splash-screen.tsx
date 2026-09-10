import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { brand } from '@/constants/brand';
import { hasSupabase } from '@/constants/config';
import { colors } from '@/constants/theme';
import { useSession } from '@/features/auth/hooks/use-session';
import { usePersistHydrated } from '@/hooks/use-persist-hydrated';
import { getOnboardingComplete } from '@/lib/storage';

import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { useFlow } from '../hooks/use-flow';
import { useOnboarding } from '../store';

const HERO_DELAY_MS = 1400;

async function readOnboardingDone(): Promise<boolean> {
  try {
    return await getOnboardingComplete();
  } catch {
    return false;
  }
}

const enter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.94 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.out(Easing.ease) },
}).duration(400);

export default function SplashScreen() {
  const flow = useFlow('index');
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = usePersistHydrated(useOnboarding);
  const { isSignedIn, isLoading: sessionLoading } = useSession();
  const navigated = useRef(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      setOnboardingDone(await readOnboardingDone());
    };
    void load();
    const timer = setTimeout(() => setDelayDone(true), HERO_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigated.current || !hydrated || onboardingDone === null) {
      return;
    }
    if (pathname !== '/') {
      return;
    }
    if (!onboardingDone) {
      if (!delayDone) {
        return;
      }
      navigated.current = true;
      router.replace('/welcome');
      return;
    }
    if (sessionLoading) {
      return;
    }
    navigated.current = true;
    router.replace(hasSupabase && !isSignedIn ? '/sign-in' : '/home');
  }, [router, pathname, hydrated, delayDone, onboardingDone, sessionLoading, isSignedIn]);

  if (!hydrated || onboardingDone !== false) {
    return <View style={styles.placeholder} />;
  }

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
  placeholder: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
