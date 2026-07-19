import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, text, withAlpha } from '@/constants/theme';
import { obstacleOptions } from '../types';
import { useFlow } from '../hooks/use-flow';

export default function ObstaclesScreen() {
  const obstacle = useOnboarding((state) => state.obstacle);
  const set = useOnboarding((state) => state.set);
  const { selectAndAdvance } = useFlow('obstacles');

  return (
    <OnboardingScaffold step="obstacles" ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title="What’s stopping you from quitting?" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <GlassGroup spacing={10} style={styles.group}>
            {obstacleOptions.map((option) => (
              <ObstacleRow
                key={option.id}
                label={option.label}
                symbol={option.symbol}
                selected={obstacle === option.id}
                onPress={() => selectAndAdvance(() => set('obstacle', option.id))}
              />
            ))}
          </GlassGroup>
        </ScrollView>
      </View>
    </OnboardingScaffold>
  );
}

function ObstacleRow({
  label,
  symbol,
  selected,
  onPress,
}: {
  label: string;
  symbol: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useDerivedValue(() => withSpring(selected ? 1.015 : 1, { damping: 15, stiffness: 220 }));
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress}>
        <GlassSurface
          radius={18}
          tintColor={selected ? colors.ink : withAlpha(colors.cardFill, 0.85)}
          isInteractive>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Icon name={symbol} size={17} weight="semibold" color={colors.ink} />
            </View>
            <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>{label}</Text>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  group: {
    paddingHorizontal: 25,
    paddingTop: 81,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 15,
    minHeight: 68,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
