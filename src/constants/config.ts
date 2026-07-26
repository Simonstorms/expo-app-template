import Constants from 'expo-constants';
import * as Device from 'expo-device';

const extra: Record<string, unknown> = Constants.expoConfig?.extra ?? {};
const devApiKeyFromExtra = extra.devApiKey;

export const config = {
  env: process.env.EXPO_PUBLIC_ENV ?? 'development',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
  revenueCatEntitlement: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'pro',
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '',
  posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  posthogSessionReplay: process.env.EXPO_PUBLIC_POSTHOG_SESSION_REPLAY === 'true',
  devApiKey: typeof devApiKeyFromExtra === 'string' ? devApiKeyFromExtra : '',
} as const;

export const hasSupabase = config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0;

export const hasRevenueCat =
  Device.isDevice && (config.revenueCatIosKey.length > 0 || config.revenueCatAndroidKey.length > 0);

export const hasPostHog = config.posthogKey.length > 0;

export const hasDevApiKey = config.devApiKey.length > 0;

type ProductionService = 'supabase' | 'revenuecat' | 'posthog';

const productionServiceLabels: Record<ProductionService, string> = {
  supabase: 'Supabase',
  revenuecat: 'RevenueCat',
  posthog: 'PostHog',
};

const productionServiceConfigured: Record<ProductionService, boolean> = {
  supabase: hasSupabase,
  revenuecat: config.revenueCatIosKey.length > 0 || config.revenueCatAndroidKey.length > 0,
  posthog: hasPostHog,
};

const allProductionServices: readonly ProductionService[] = ['supabase', 'revenuecat', 'posthog'];

const requiredProductionServices: readonly ProductionService[] = [];

function unconfiguredLabels(services: readonly ProductionService[]): string[] {
  return services
    .filter((service) => !productionServiceConfigured[service])
    .map((service) => productionServiceLabels[service]);
}

export function missingProductionServices(): string[] {
  if (config.env !== 'production') return [];
  return unconfiguredLabels(allProductionServices);
}

export function assertProductionServicesConfigured(): void {
  if (config.env !== 'production' || requiredProductionServices.length === 0) return;
  const missing = unconfiguredLabels(requiredProductionServices);
  if (missing.length === 0) return;
  throw new Error(`Production build is missing required service config: ${missing.join(', ')}`);
}
