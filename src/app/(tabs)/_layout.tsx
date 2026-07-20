import { Redirect, Tabs, type Href } from 'expo-router';

import { Icon } from '@/components/ui/icon';
import { hasRevenueCat, hasSupabase } from '@/constants/config';
import { content } from '@/constants/content';
import { colors } from '@/constants/theme';
import { useSession } from '@/features/auth/hooks/use-session';
import { useEntitlement } from '@/features/paywall/hooks/use-entitlement';

export default function TabsLayout() {
  const { isSignedIn, isLoading: sessionLoading } = useSession();
  const { isPro, isLoading: entitlementLoading } = useEntitlement();

  if (sessionLoading || entitlementLoading) return null;
  if (hasSupabase && !isSignedIn) return <Redirect href={'/sign-in' as Href} />;
  if (hasRevenueCat && !isPro) return <Redirect href={'/paywall' as Href} />;

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
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: content.home.tabTitle,
          tabBarIcon: ({ color, size }) => <Icon name="house.fill" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: content.settings.title,
          tabBarIcon: ({ color, size }) => <Icon name="gearshape.fill" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
