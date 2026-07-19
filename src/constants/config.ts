export const config = {
  env: process.env.EXPO_PUBLIC_ENV ?? 'development',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
  revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
  superwallIosKey: process.env.EXPO_PUBLIC_SUPERWALL_IOS_KEY ?? '',
  superwallAndroidKey: process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_KEY ?? '',
  revenueCatEntitlement: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'pro',
  superwallPlacement: process.env.EXPO_PUBLIC_SUPERWALL_PLACEMENT ?? 'onboarding_complete',
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '',
  posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  posthogSessionReplay: process.env.EXPO_PUBLIC_POSTHOG_SESSION_REPLAY === 'true',
} as const;

export const hasSupabase = config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0;

export const hasRevenueCat =
  config.revenueCatIosKey.length > 0 || config.revenueCatAndroidKey.length > 0;

export const hasSuperwall =
  config.superwallIosKey.length > 0 || config.superwallAndroidKey.length > 0;

export const hasPostHog = config.posthogKey.length > 0;
