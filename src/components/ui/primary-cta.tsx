import { Pressable, StyleSheet, Text } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { colors, layout, text } from '@/constants/theme';

export function PrimaryCTA({
  title,
  enabled = true,
  onPress,
}: {
  title: string;
  enabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      disabled={!enabled}
      style={({ pressed }) => ({ opacity: pressed && enabled ? 0.92 : 1 })}>
      <GlassSurface
        radius={layout.ctaHeight / 2}
        tintColor={enabled ? colors.ctaFill : colors.disabledFill}
        fallbackColor={enabled ? colors.ctaFill : colors.disabledFill}
        isInteractive
        style={styles.button}>
        <Text style={[text.cta, styles.label]}>{title}</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: layout.ctaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.white,
  },
});
