import { usePathname } from 'expo-router';
import PostHog, { PostHogProvider } from 'posthog-react-native';
import { type ReactNode, useEffect } from 'react';

import { config, hasPostHog } from '@/constants/config';

type EventProperties = NonNullable<Parameters<PostHog['capture']>[1]>;

export const posthog = hasPostHog
  ? new PostHog(config.posthogKey, {
      host: config.posthogHost,
      enableSessionReplay: config.posthogSessionReplay,
      sessionReplayConfig: {
        maskAllTextInputs: true,
        maskAllImages: false,
        captureLog: true,
      },
      captureAppLifecycleEvents: true,
    })
  : null;

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  if (!posthog) return <>{children}</>;
  return (
    <PostHogProvider client={posthog} autocapture={{ captureTouches: true, captureScreens: false }}>
      {children}
    </PostHogProvider>
  );
}

export function ScreenTracker() {
  const pathname = usePathname();

  useEffect(() => {
    posthog?.screen(pathname);
  }, [pathname]);

  return null;
}

export function identifyUser(userId: string, properties?: EventProperties): void {
  posthog?.identify(userId, properties);
}

export function resetUser(): void {
  posthog?.reset();
}

export function captureEvent(event: string, properties?: EventProperties): void {
  posthog?.capture(event, properties);
}

export { useFeatureFlag } from 'posthog-react-native';
