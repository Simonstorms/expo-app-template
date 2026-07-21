import * as Device from 'expo-device';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

let glassAvailable = false;
try {
  glassAvailable = isLiquidGlassAvailable() && Device.isDevice;
} catch {
  glassAvailable = false;
}

type GlassProps = {
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  glassEffectStyle?: 'regular' | 'clear';
  isInteractive?: boolean;
  fallbackColor?: string;
  children?: ReactNode;
};

function Glass({
  style,
  tintColor,
  glassEffectStyle = 'regular',
  isInteractive = false,
  fallbackColor,
  children,
}: GlassProps) {
  if (glassAvailable) {
    return (
      <GlassView
        style={style}
        tintColor={tintColor}
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}>
        {children}
      </GlassView>
    );
  }
  return (
    <View style={[style, { backgroundColor: fallbackColor ?? tintColor ?? 'rgba(249, 248, 253, 0.94)' }]}>
      {children}
    </View>
  );
}

export function GlassGroup({
  spacing = 0,
  style,
  children,
}: {
  spacing?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return <View style={[{ gap: spacing }, style]}>{children}</View>;
}

type GlassSurfaceProps = GlassProps & { radius?: number };

export function GlassSurface({
  style,
  radius = 0,
  tintColor,
  glassEffectStyle = 'regular',
  isInteractive = false,
  fallbackColor,
  children,
}: GlassSurfaceProps) {
  return (
    <View style={style}>
      <Glass
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        tintColor={tintColor}
        glassEffectStyle={glassEffectStyle}
        isInteractive={isInteractive}
        fallbackColor={fallbackColor}
      />
      {children}
    </View>
  );
}
