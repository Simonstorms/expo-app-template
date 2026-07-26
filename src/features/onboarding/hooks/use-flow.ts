import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

import { captureEvent, setPersonProperties } from '@/lib/analytics';
import { setOnboardingComplete } from '@/lib/storage';
import type { Json } from '@/types/database';
import { syncOnboarding } from '../api';
import { onboardingAnswers } from '../store';
import { nextStep, progressFor, routePath, showsChrome, STEPS, type Step } from '../steps';

const ADVANCE_DELAY_MS = 140;

type AnswerValue = string | number | boolean;

type Answers = Record<string, unknown>;

function describeValue(value: unknown): AnswerValue {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  return JSON.stringify(value ?? null);
}

function answerFromDiff(before: Answers, after: Answers): AnswerValue | undefined {
  const changed = Object.keys(after).filter((key) => !Object.is(before[key], after[key]));
  if (changed.length === 0) return undefined;
  if (changed.length === 1) return describeValue(after[changed[0]]);
  return changed.map((key) => `${key}=${describeValue(after[key])}`).join(',');
}

export type OnboardingFlow = {
  advance: () => void;
  replaceAdvance: () => void;
  goTo: (target: Step) => void;
  back: () => void;
  selectAndAdvance: (mutate: () => void) => void;
  selectHaptic: () => void;
  finish: () => Promise<void>;
  progress: number;
  showsChrome: boolean;
  canGoBack: boolean;
};

export function useFlow(step: Step): OnboardingFlow {
  const router = useRouter();
  const advancing = useRef(false);
  const answersOnEntry = useRef<Answers>(onboardingAnswers());

  useFocusEffect(
    useCallback(() => {
      advancing.current = false;
      answersOnEntry.current = onboardingAnswers();
    }, []),
  );

  const trackStepCompleted = useCallback(() => {
    captureEvent('onboarding_step_completed', {
      step,
      step_index: STEPS.indexOf(step),
      answer: answerFromDiff(answersOnEntry.current, onboardingAnswers()),
    });
  }, [step]);

  const advance = useCallback(() => {
    const next = nextStep(step);
    if (!next) return;
    trackStepCompleted();
    router.push(routePath(next));
  }, [router, step, trackStepCompleted]);

  const replaceAdvance = useCallback(() => {
    const next = nextStep(step);
    if (!next) return;
    trackStepCompleted();
    router.replace(routePath(next));
  }, [router, step, trackStepCompleted]);

  const goTo = useCallback(
    (target: Step) => {
      router.push(routePath(target));
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
    const values = onboardingAnswers() as Json;
    captureEvent('onboarding_completed', { steps_total: STEPS.length });
    setPersonProperties({ has_completed_onboarding: true });
    await syncOnboarding(values).catch(() => undefined);
    await setOnboardingComplete(true).catch(() => undefined);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/home');
  }, [router]);

  return {
    advance,
    replaceAdvance,
    goTo,
    back,
    selectAndAdvance,
    selectHaptic,
    finish,
    progress: progressFor(step),
    showsChrome: showsChrome(step),
    canGoBack: router.canGoBack(),
  };
}
