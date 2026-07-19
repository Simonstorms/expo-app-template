import { create } from 'zustand';

import type {
  DiscoverySource,
  Gender,
  Obstacle,
  QuitGoal,
  SnusType,
  UsageLevel,
} from './types';

type OnboardingState = {
  gender?: Gender;
  usageLevel?: UsageLevel;
  discoverySource?: DiscoverySource;
  triedBefore?: boolean;
  snusType: SnusType;
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

type OnboardingValues = Omit<OnboardingState, 'set' | 'reset'>;

const initialState: OnboardingValues = {
  gender: undefined,
  usageLevel: undefined,
  discoverySource: undefined,
  triedBefore: undefined,
  snusType: 'pouches',
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

export const useOnboarding = create<OnboardingState>((setState) => ({
  ...initialState,
  set: (key, value) => setState({ [key]: value } as Partial<OnboardingState>),
  reset: () => setState(initialState),
}));
