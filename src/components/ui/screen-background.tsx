import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { accentGradient, backgroundGradient, frostGradient } from '@/constants/theme';

export type BackgroundVariant = 'light' | 'accent' | 'frost';

type Gradient = {
  colors: readonly [string, string, ...string[]];
  locations: readonly [number, number, ...number[]];
};

const gradients: Record<BackgroundVariant, Gradient> = {
  light: backgroundGradient,
  accent: accentGradient,
  frost: frostGradient,
};

export function ScreenBackground({ variant = 'light' }: { variant?: BackgroundVariant }) {
  const gradient = gradients[variant];
  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
