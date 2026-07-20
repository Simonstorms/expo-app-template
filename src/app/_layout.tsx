import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAnalyticsIdentity } from '@/hooks/use-analytics-identity';
import { useAuthDeepLink } from '@/features/auth/hooks/use-auth-deep-link';
import { useRevenueCatSync } from '@/features/paywall/hooks/use-revenuecat';
import { AnalyticsProvider, ScreenTracker } from '@/lib/analytics';
import { queryClient } from '@/lib/query-client';

SplashScreen.preventAutoHideAsync();

function AppServices() {
  useRevenueCatSync();
  useAnalyticsIdentity();
  useAuthDeepLink();
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
