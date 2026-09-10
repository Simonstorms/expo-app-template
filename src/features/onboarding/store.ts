import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isRecord } from '@/lib/guards';
import { runInBackground } from '@/lib/tasks';

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

function deviceLanguage(): string {
  return getLocales()[0]?.languageTag ?? 'en';
}

function answersOf(state: OnboardingState): OnboardingValues {
  return {
    language: state.language,
    gender: state.gender,
    usageLevel: state.usageLevel,
    discoverySource: state.discoverySource,
    triedBefore: state.triedBefore,
    variant: state.variant,
    yearsOfUse: state.yearsOfUse,
    pouchesPerDay: state.pouchesPerDay,
    birthMonth: state.birthMonth,
    birthDay: state.birthDay,
    birthYear: state.birthYear,
    goal: state.goal,
    weeklySpend: state.weeklySpend,
    reducePerWeek: state.reducePerWeek,
    obstacle: state.obstacle,
    healthConnected: state.healthConnected,
    showSavings: state.showSavings,
    rolloverPouches: state.rolloverPouches,
    referralCode: state.referralCode,
  };
}

function isOnboardingValues(value: unknown): value is OnboardingValues {
  return (
    isRecord(value) &&
    typeof value.language === 'string' &&
    typeof value.variant === 'string' &&
    typeof value.yearsOfUse === 'number' &&
    typeof value.pouchesPerDay === 'number' &&
    typeof value.birthMonth === 'number' &&
    typeof value.birthDay === 'number' &&
    typeof value.birthYear === 'number' &&
    typeof value.weeklySpend === 'number' &&
    typeof value.reducePerWeek === 'number' &&
    typeof value.healthConnected === 'boolean' &&
    typeof value.referralCode === 'string'
  );
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

async function recoverPersistedState(): Promise<void> {
  await AsyncStorage.removeItem(PERSIST_KEY);
  await useOnboarding.persist.rehydrate();
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (setState) => ({
      ...initialState,
      set: (key, value) => {
        setState((state) => ({ ...state, [key]: value }));
      },
      reset: () => {
        setState(initialState);
      },
    }),
    {
      name: PERSIST_KEY,
      version: PERSIST_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: answersOf,
      migrate: (persisted, version) =>
        version === PERSIST_VERSION && isOnboardingValues(persisted) ? persisted : initialState,
      onRehydrateStorage: () => (_state, error) => {
        if (!error || rehydrateRecovered) {
          return;
        }
        rehydrateRecovered = true;
        void runInBackground(recoverPersistedState());
      },
    },
  ),
);

export function onboardingAnswers(): Record<string, unknown> {
  return { ...answersOf(useOnboarding.getState()) };
}
