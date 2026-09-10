import { usePathname } from 'expo-router';
import PostHog, { PostHogProvider } from 'posthog-react-native';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { config, hasPostHog } from '@/constants/config';
import type { AnalyticsEventName, AnalyticsEvents } from '@/lib/analytics-events';
import { runInBackground } from '@/lib/tasks';

type PersonProperties = Record<string, string | number | boolean | null>;

type EmptyProperties = Record<never, never>;

type EventArguments<E extends AnalyticsEventName> = AnalyticsEvents[E] extends undefined
  ? []
  : EmptyProperties extends AnalyticsEvents[E]
    ? [properties?: AnalyticsEvents[E]]
    : [properties: AnalyticsEvents[E]];

export const posthog = hasPostHog
  ? new PostHog(config.posthogKey, {
      host: config.posthogHost,
      flushAt: 10,
      personProfiles: 'identified_only',
      preloadFeatureFlags: false,
      enableSessionReplay: config.posthogSessionReplay,
      sessionReplayConfig: {
        maskAllTextInputs: true,
        maskAllImages: true,
        captureLog: false,
      },
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          nativeCrashes: true,
        },
      },
    })
  : null;

void posthog?.register({ env: config.env });

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  if (!posthog) {
    return children;
  }
  return (
    <PostHogProvider client={posthog} autocapture={{ captureTouches: true, captureScreens: false }}>
      {children}
    </PostHogProvider>
  );
}

export function ScreenTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void posthog?.screen(pathname);
  }, [pathname]);

  return null;
}

export function identifyUser(userId: string, properties?: PersonProperties): void {
  posthog?.identify(userId, properties);
}

export function resetUser(): void {
  posthog?.reset();
}

export function captureEvent<E extends AnalyticsEventName>(
  event: E,
  ...properties: EventArguments<E>
): void {
  posthog?.capture(event, properties[0] ?? undefined);
}

export function captureEventAt<E extends AnalyticsEventName>(
  event: E,
  properties: AnalyticsEvents[E],
  timestampMs: number,
): void {
  posthog?.capture(event, properties ?? undefined, {
    timestamp: new Date(timestampMs),
  });
}

export function registerSuperProperties(properties: PersonProperties): void {
  void posthog?.register(properties);
}

export function setPersonProperties(properties: PersonProperties): void {
  posthog?.setPersonProperties(properties);
}

export function setPersonPropertiesOnce(properties: PersonProperties): void {
  posthog?.setPersonProperties(undefined, properties);
}

export function flushAnalytics(): void {
  if (!posthog) {
    return;
  }
  void runInBackground(posthog.flush());
}

export function analyticsDistinctId(): string | undefined {
  return posthog?.getDistinctId();
}

export function analyticsOptedOut(): boolean {
  return posthog?.optedOut ?? false;
}

export async function setAnalyticsOptOut(optedOut: boolean): Promise<void> {
  if (!posthog) {
    return;
  }
  if (optedOut) {
    posthog.capture('analytics_opt_out_toggled', { opted_out: true });
    await runInBackground(posthog.flush());
    await posthog.optOut();
    return;
  }
  await posthog.optIn();
  posthog.capture('analytics_opt_out_toggled', { opted_out: false });
}

export { useFeatureFlag } from 'posthog-react-native';
