import { StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { colors, shadow, withAlpha } from '@/constants/theme';

export function GlassIconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 48,
  iconSize = 19,
  iconColor = colors.ink,
}: {
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  iconColor?: string;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      scaleTo={0.95}
    >
      <GlassSurface
        radius={size / 2}
        tintColor={withAlpha(colors.white, 0.85)}
        fallbackColor={withAlpha(colors.white, 0.96)}
        isInteractive
        style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Icon name={icon} size={iconSize} weight="semibold" color={iconColor} />
      </GlassSurface>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
});
