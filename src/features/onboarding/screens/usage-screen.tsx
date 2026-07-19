import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, text, withAlpha } from '@/constants/theme';
import { usageOptions } from '../types';
import { useFlow } from '../hooks/use-flow';

export default function UsageFrequencyScreen() {
  const usageLevel = useOnboarding((state) => state.usageLevel);
  const set = useOnboarding((state) => state.set);
  const { selectAndAdvance } = useFlow('usage');

  return (
    <OnboardingScaffold step="usage" ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock
          title={'How many pouches\ndo you use per day?'}
          subtitle={'This will be used to calibrate your\ncustom plan.'}
        />
        <View style={styles.topSpacer} />
        <GlassGroup spacing={22} style={styles.group}>
          {usageOptions.map((option) => (
            <UsageRow
              key={option.id}
              label={option.label}
              caption={option.caption}
              dots={option.dots}
              selected={usageLevel === option.id}
              onPress={() => selectAndAdvance(() => set('usageLevel', option.id))}
            />
          ))}
        </GlassGroup>
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function UsageRow({
  label,
  caption,
  dots,
  selected,
  onPress,
}: {
  label: string;
  caption: string;
  dots: number;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useDerivedValue(() => withSpring(selected ? 1.015 : 1, { damping: 15, stiffness: 220 }));
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress}>
        <GlassSurface
          radius={layout.cardRadius}
          tintColor={selected ? colors.ink : withAlpha(colors.cardFill, 0.85)}
          isInteractive>
          <View style={styles.row}>
            <DotClusterIcon dots={dots} />
            <View style={styles.textColumn}>
              <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>{label}</Text>
              <Text style={[text.caption, { color: selected ? colors.white : colors.ink }]}>{caption}</Text>
            </View>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

function DotClusterIcon({ dots }: { dots: number }) {
  const { rows, size, gap } = dotClusterConfig(dots);
  return (
    <View style={styles.dotCircle}>
      <View style={styles.dotRows}>
        {rows.map((count, rowIndex) => (
          <View key={rowIndex} style={[styles.dotRow, { gap }]}>
            {Array.from({ length: count }).map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: colors.ctaFill,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function dotClusterConfig(dots: number): { rows: number[]; size: number; gap: number } {
  if (dots === 1) return { rows: [1], size: 12.3, gap: 2.7 };
  if (dots === 3) return { rows: [1, 2], size: 7, gap: 5 };
  return { rows: [2, 2, 2], size: 3.3, gap: 2.7 };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    flex: 1,
    minHeight: 40,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 44,
  },
  group: {
    paddingHorizontal: layout.margin,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 15,
    minHeight: 90,
    width: '100%',
  },
  textColumn: {
    alignItems: 'flex-start',
    gap: 4,
  },
  dotCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotRows: {
    gap: 2.5,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
