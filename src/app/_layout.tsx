import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SuperwallProvider } from 'expo-superwall';
import { type ReactNode, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { hasSuperwall } from '@/constants/config';
import { useAnalyticsIdentity } from '@/hooks/use-analytics-identity';
import { useRevenueCatSync } from '@/features/paywall/hooks/use-revenuecat';
import { AnalyticsProvider, ScreenTracker } from '@/lib/analytics';
import { queryClient } from '@/lib/query-client';
import { superwallApiKeys } from '@/lib/superwall';

SplashScreen.preventAutoHideAsync();

function PaywallProvider({ children }: { children: ReactNode }) {
  if (hasSuperwall) {
    return <SuperwallProvider apiKeys={superwallApiKeys}>{children}</SuperwallProvider>;
  }
  return <>{children}</>;
}

function AppServices() {
  useRevenueCatSync();
  useAnalyticsIdentity();
  return null;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaywallProvider>
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
                  gestureEnabled: true,
                }}
              />
            </SafeAreaProvider>
          </AnalyticsProvider>
        </PaywallProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
