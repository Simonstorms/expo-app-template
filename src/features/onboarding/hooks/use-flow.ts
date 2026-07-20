import * as Haptics from 'expo-haptics';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

import { captureEvent } from '@/lib/analytics';
import { setOnboardingComplete } from '@/lib/storage';
import type { Json } from '@/types/database';
import { syncOnboarding } from '../api';
import { useOnboarding } from '../store';
import { nextStep, progressFor, routePath, showsChrome, type Step } from '../steps';

const ADVANCE_DELAY_MS = 140;

export type OnboardingFlow = {
  advance: () => void;
  goTo: (target: Step) => void;
  back: () => void;
  selectAndAdvance: (mutate: () => void) => void;
  selectHaptic: () => void;
  finish: () => Promise<void>;
  progress: number;
  showsChrome: boolean;
};

export function useFlow(step: Step): OnboardingFlow {
  const router = useRouter();
  const advancing = useRef(false);

  useFocusEffect(
    useCallback(() => {
      advancing.current = false;
    }, []),
  );

  const advance = useCallback(() => {
    const next = nextStep(step);
    if (!next) return;
    router.push(routePath(next) as Href);
  }, [router, step]);

  const goTo = useCallback(
    (target: Step) => {
      router.push(routePath(target) as Href);
    },
    [router],
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const selectHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
  }, []);

  const selectAndAdvance = useCallback(
    (mutate: () => void) => {
      if (advancing.current) return;
      advancing.current = true;
      mutate();
      selectHaptic();
      setTimeout(advance, ADVANCE_DELAY_MS);
    },
    [advance, selectHaptic],
  );

  const finish = useCallback(async () => {
    const values = JSON.parse(JSON.stringify(useOnboarding.getState())) as Json;
    captureEvent('onboarding_completed');
    await syncOnboarding(values).catch(() => undefined);
    await setOnboardingComplete(true).catch(() => undefined);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    const home: string = '/home';
    router.replace(home as Href);
  }, [router]);

  return {
    advance,
    goTo,
    back,
    selectAndAdvance,
    selectHaptic,
    finish,
    progress: progressFor(step),
    showsChrome: showsChrome(step),
  };
}
