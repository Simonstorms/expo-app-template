import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Platform } from 'react-native';

import { captureEvent, setPersonProperties } from '@/lib/analytics';
import { toJson } from '@/lib/json';
import { setOnboardingComplete } from '@/lib/storage';
import { attempt, runInBackground } from '@/lib/tasks';

import { syncOnboarding } from '../api';
import { nextStep, progressFor, routePath, showsChrome, STEPS } from '../steps';
import type { Step } from '../steps';
import { onboardingAnswers } from '../store';

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
  if (changed.length === 0) {
    return undefined;
  }
  if (changed.length === 1) {
    return describeValue(after[changed[0]]);
  }
  return changed.map((key) => `${key}=${describeValue(after[key])}`).join(',');
}

function selectHaptic(): void {
  if (Platform.OS !== 'web') {
    void runInBackground(Haptics.selectionAsync());
  }
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
  const answersOnEntry = useRef<Answers>({});

  useFocusEffect(() => {
    advancing.current = false;
    answersOnEntry.current = onboardingAnswers();
  });

  const trackStepCompleted = () => {
    captureEvent('onboarding_step_completed', {
      step,
      step_index: STEPS.indexOf(step),
      answer: answerFromDiff(answersOnEntry.current, onboardingAnswers()),
    });
  };

  const advance = () => {
    const next = nextStep(step);
    if (!next) {
      return;
    }
    trackStepCompleted();
    router.push(routePath(next));
  };

  const replaceAdvance = () => {
    const next = nextStep(step);
    if (!next) {
      return;
    }
    trackStepCompleted();
    router.replace(routePath(next));
  };

  const goTo = (target: Step) => {
    router.push(routePath(target));
  };

  const back = () => {
    router.back();
  };

  const selectAndAdvance = (mutate: () => void) => {
    if (advancing.current) {
      return;
    }
    advancing.current = true;
    mutate();
    selectHaptic();
    setTimeout(advance, ADVANCE_DELAY_MS);
  };

  const finish = async () => {
    const values = toJson(onboardingAnswers());
    captureEvent('onboarding_completed', { steps_total: STEPS.length });
    setPersonProperties({ has_completed_onboarding: true });
    await attempt(syncOnboarding(values));
    await attempt(setOnboardingComplete(true));
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/home');
  };

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
