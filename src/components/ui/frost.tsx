import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, layout, shadow, withAlpha } from '@/constants/theme';

type FrostProps = {
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

function FrostSurface({
  radius,
  sheen,
  border,
  elevation,
  style,
  children,
}: FrostProps & {
  radius: number;
  sheen: readonly [string, string];
  border: string;
  elevation: ViewStyle;
}) {
  return (
    <View style={[elevation, { borderRadius: radius }, style]}>
      <LinearGradient
        colors={sheen}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        pointerEvents="none"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, borderWidth: 1, borderColor: border },
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

export function FrostCard({ radius = layout.cardRadius, style, children }: FrostProps) {
  return (
    <FrostSurface
      radius={radius}
      sheen={[withAlpha(colors.white, 0.62), withAlpha(colors.white, 0.3)]}
      border={withAlpha(colors.white, 0.65)}
      elevation={shadow.card}
      style={style}
    >
      {children}
    </FrostSurface>
  );
}

export function FrostPill({ radius = 999, style, children }: FrostProps) {
  return (
    <FrostSurface
      radius={radius}
      sheen={[withAlpha(colors.white, 0.72), withAlpha(colors.white, 0.4)]}
      border={withAlpha(colors.white, 0.7)}
      elevation={shadow.soft}
      style={style}
    >
      {children}
    </FrostSurface>
  );
}
