import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { assertProductionServicesConfigured } from '@/constants/config';
import { useRevenueCatSync } from '@/features/paywall/hooks/use-revenuecat';
import { useAnalyticsIdentity } from '@/hooks/use-analytics-identity';
import { useAnalyticsSuperProperties } from '@/hooks/use-analytics-super-properties';
import { useNotificationIntent } from '@/hooks/use-notification-intent';
import { AnalyticsProvider, ScreenTracker } from '@/lib/analytics';
import { queryClient } from '@/lib/query-client';

assertProductionServicesConfigured();

SplashScreen.preventAutoHideAsync();

function AppServices() {
  useRevenueCatSync();
  useAnalyticsIdentity();
  useAnalyticsSuperProperties();
  useNotificationIntent();
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          <SafeAreaProvider>
            <ReducedMotionConfig mode={ReduceMotion.System} />
            <AppServices />
            <ScreenTracker />
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#ffffff' },
                animation: 'slide_from_right',
                animationDuration: 300,
                animationMatchesGesture: true,
                gestureEnabled: true,
              }}
            />
          </SafeAreaProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
