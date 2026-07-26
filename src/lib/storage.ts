import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = 'app.onboarding-complete';
const LAST_KNOWN_ENTITLEMENT_KEY = 'app.last-known-entitlement';

const ENTITLEMENT_GRACE_MS = 72 * 60 * 60 * 1000;

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, value ? '1' : '0');
}

export async function getOnboardingComplete(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
  return stored === '1';
}

export async function setLastKnownEntitlement(value: boolean): Promise<void> {
  await AsyncStorage.setItem(LAST_KNOWN_ENTITLEMENT_KEY, `${value ? '1' : '0'}|${Date.now()}`);
}

export async function getLastKnownEntitlement(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(LAST_KNOWN_ENTITLEMENT_KEY);
  if (stored === null) return false;
  const [value, timestampRaw] = stored.split('|');
  if (value !== '1') return false;
  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= 0 && age < ENTITLEMENT_GRACE_MS;
}

export async function clearLastKnownEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(LAST_KNOWN_ENTITLEMENT_KEY);
}
