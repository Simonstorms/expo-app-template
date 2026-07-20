import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { backgroundGradient } from '@/constants/theme';

export const ScreenBackground = memo(function ScreenBackground() {
  return (
    <LinearGradient
      colors={backgroundGradient.colors}
      locations={backgroundGradient.locations}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
});
