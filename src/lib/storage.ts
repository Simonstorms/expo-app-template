import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = 'quitsnus.onboarding-complete';

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, value ? '1' : '0');
}

export async function getOnboardingComplete(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
  return stored === '1';
}
