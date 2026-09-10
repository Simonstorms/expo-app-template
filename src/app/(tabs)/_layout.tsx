import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { hasRevenueCat, hasSupabase } from '@/constants/config';
import { content } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useSession } from '@/features/auth/hooks/use-session';
import { useEntitlement } from '@/features/paywall/hooks/use-entitlement';

export default function TabsLayout() {
  const { isSignedIn, isLoading: sessionLoading } = useSession();
  const { isPro, isLoading: entitlementLoading } = useEntitlement();

  if ((hasSupabase && sessionLoading) || (hasRevenueCat && entitlementLoading)) {
    return <View style={styles.gate} />;
  }

  if (hasSupabase && !isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  if (hasRevenueCat && !isPro) {
    return <Redirect href={{ pathname: '/paywall', params: { context: 'gate' } }} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.disabledFill,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.hairline,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: content.home.tabTitle,
          tabBarIcon: ({ color, size }) => <Icon name="house.fill" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: content.settings.title,
          tabBarIcon: ({ color, size }) => <Icon name="gearshape.fill" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
