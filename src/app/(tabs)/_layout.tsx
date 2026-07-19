import { Tabs } from 'expo-router';

import { Icon } from '@/components/ui/icon';
import { colors } from '@/constants/theme';

export default function TabsLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="house.fill" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="gearshape.fill" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
