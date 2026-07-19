import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { colors, layout, text } from '@/constants/theme';

export function ChoicePairButtons({
  leftTitle = 'No',
  rightTitle = 'Yes',
  onChoice,
}: {
  leftTitle?: string;
  rightTitle?: string;
  onChoice: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <ChoiceButton title={leftTitle} onPress={() => onChoice(false)} />
      <ChoiceButton title={rightTitle} onPress={() => onChoice(true)} />
    </View>
  );
}

function ChoiceButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.flex, { opacity: pressed ? 0.92 : 1 }]}>
      <GlassSurface
        radius={layout.ctaHeight / 2}
        tintColor={colors.ctaFill}
        fallbackColor={colors.ctaFill}
        isInteractive
        style={styles.button}>
        <Text style={[text.cta, styles.label]}>{title}</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 13,
  },
  flex: {
    flex: 1,
  },
  button: {
    height: layout.ctaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.white,
  },
});
