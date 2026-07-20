import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { content } from '@/constants/content';
import { colors, layout, text, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

export default function TriedBeforeScreen() {
  const triedBefore = useOnboarding((state) => state.triedBefore);
  const set = useOnboarding((state) => state.set);
  const flow = useFlow('tried-before');
  const { selectAndAdvance } = flow;

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title={content.triedBefore.title} />
        <View style={styles.spacer} />
        <GlassGroup spacing={22} style={styles.group}>
          <ThumbChoiceRow
            title={content.triedBefore.no}
            symbol="hand.thumbsdown.fill"
            selected={triedBefore === false}
            onPress={() => selectAndAdvance(() => set('triedBefore', false))}
          />
          <ThumbChoiceRow
            title={content.triedBefore.yes}
            symbol="hand.thumbsup.fill"
            selected={triedBefore === true}
            onPress={() => selectAndAdvance(() => set('triedBefore', true))}
          />
        </GlassGroup>
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function ThumbChoiceRow({
  title,
  symbol,
  selected,
  onPress,
}: {
  title: string;
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
          radius={layout.cardRadius}
          tintColor={selected ? colors.ink : withAlpha(colors.cardFill, 0.85)}
          isInteractive>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Icon name={symbol} size={18} weight="semibold" color={colors.ink} />
            </View>
            <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>{title}</Text>
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
  spacer: {
    flex: 1,
    minHeight: 0,
  },
  group: {
    paddingHorizontal: layout.margin,
  },
  bottomSpacer: {
    height: 183,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 60,
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
