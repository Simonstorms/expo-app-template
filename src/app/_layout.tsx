import { QueryClientProvider } from '@tanstack/react-query';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PrimaryCTA } from '@/components/ui/primary-cta';
import { assertProductionServicesConfigured } from '@/constants/config';
import { content } from '@/constants/content';
import { colors, layout, text } from '@/constants/theme';
import { useRevenueCatSync } from '@/features/paywall/hooks/use-revenuecat';
import { useAnalyticsIdentity } from '@/hooks/use-analytics-identity';
import { useAnalyticsSuperProperties } from '@/hooks/use-analytics-super-properties';
import { useNotificationIntent } from '@/hooks/use-notification-intent';
import { AnalyticsProvider, captureEvent, ScreenTracker } from '@/lib/analytics';
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

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  captureEvent('app_error_boundary', { message: error.message });

  return (
    <View style={styles.errorRoot}>
      <Text style={styles.errorTitle}>{content.errorBoundary.title}</Text>
      <Text style={styles.errorBody}>{content.errorBoundary.body}</Text>
      <View style={styles.errorAction}>
        <PrimaryCTA
          title={content.errorBoundary.retry}
          onPress={() => {
            void retry();
          }}
        />
      </View>
    </View>
  );
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

const styles = StyleSheet.create({
  errorRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: layout.margin,
    gap: 12,
  },
  errorTitle: {
    ...text.title,
    textAlign: 'center',
  },
  errorBody: {
    ...text.subtitle,
    textAlign: 'center',
  },
  errorAction: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
});
