import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  DiscoverySource,
  Gender,
  Obstacle,
  HabitVariant,
  QuitGoal,
  UsageLevel,
} from './types';

type OnboardingState = {
  language: string;
  gender?: Gender;
  usageLevel?: UsageLevel;
  discoverySource?: DiscoverySource;
  triedBefore?: boolean;
  variant: HabitVariant;
  yearsOfUse: number;
  pouchesPerDay: number;
  birthMonth: number;
  birthDay: number;
  birthYear: number;
  goal?: QuitGoal;
  weeklySpend: number;
  reducePerWeek: number;
  obstacle?: Obstacle;
  healthConnected: boolean;
  showSavings?: boolean;
  rolloverPouches?: boolean;
  referralCode: string;

  set: <K extends keyof OnboardingValues>(key: K, value: OnboardingValues[K]) => void;
  reset: () => void;
};

export type OnboardingValues = Omit<OnboardingState, 'set' | 'reset'>;

const PERSIST_KEY = 'onboarding';

const PERSIST_VERSION = 1;

let rehydrateRecovered = false;

const ACTION_KEYS: ReadonlySet<string> = new Set(['set', 'reset']);

function deviceLanguage(): string {
  return getLocales()[0]?.languageTag ?? 'en';
}

function answersOf(state: OnboardingState): OnboardingValues {
  const entries = Object.entries(state).filter(([key]) => !ACTION_KEYS.has(key));
  return Object.fromEntries(entries) as OnboardingValues;
}

const initialState: OnboardingValues = {
  language: deviceLanguage(),
  gender: undefined,
  usageLevel: undefined,
  discoverySource: undefined,
  triedBefore: undefined,
  variant: 'pouches',
  yearsOfUse: 5,
  pouchesPerDay: 10,
  birthMonth: 6,
  birthDay: 15,
  birthYear: 1995,
  goal: undefined,
  weeklySpend: 25,
  reducePerWeek: 3,
  obstacle: undefined,
  healthConnected: false,
  showSavings: undefined,
  rolloverPouches: undefined,
  referralCode: '',
};

export const useOnboarding = create<OnboardingState>()(
  persist(
    (setState) => ({
      ...initialState,
      set: (key, value) => setState({ [key]: value } as Partial<OnboardingState>),
      reset: () => setState(initialState),
    }),
    {
      name: PERSIST_KEY,
      version: PERSIST_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: answersOf,
      migrate: (persisted, version) =>
        version === PERSIST_VERSION ? (persisted as OnboardingValues) : initialState,
      onRehydrateStorage: () => (_state, error) => {
        if (!error || rehydrateRecovered) return;
        rehydrateRecovered = true;
        void AsyncStorage.removeItem(PERSIST_KEY)
          .then(() => useOnboarding.persist.rehydrate())
          .catch(() => undefined);
      },
    },
  ),
);

export function onboardingAnswers(): Record<string, unknown> {
  return { ...answersOf(useOnboarding.getState()) };
}
