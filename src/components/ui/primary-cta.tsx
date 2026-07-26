import { StyleSheet, Text } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { PressableScale } from '@/components/ui/pressable-scale';
import { colors, layout, shadow, text } from '@/constants/theme';

export type CtaVariant = 'primary' | 'secondary' | 'ghost';

const fills: Record<CtaVariant, string> = {
  primary: colors.ctaFill,
  secondary: colors.accent,
  ghost: colors.white,
};

export function PrimaryCTA({
  title,
  variant = 'primary',
  enabled = true,
  onPress,
}: {
  title: string;
  variant?: CtaVariant;
  enabled?: boolean;
  onPress: () => void;
}) {
  const fill = enabled ? fills[variant] : colors.disabledFill;
  const labelColor = variant === 'ghost' && enabled ? colors.ink : colors.white;
  const elevated = enabled && variant !== 'primary';

  return (
    <PressableScale
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !enabled }}
    >
      <GlassSurface
        radius={layout.ctaRadius}
        tintColor={fill}
        fallbackColor={fill}
        isInteractive
        style={[styles.button, elevated ? shadow.card : null]}
      >
        <Text style={[text.cta, { color: labelColor }]}>{title}</Text>
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    height: layout.ctaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
