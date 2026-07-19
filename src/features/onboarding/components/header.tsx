import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { type LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { colors, layout, withAlpha } from '@/constants/theme';

export function BackChip({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <GlassSurface
        radius={layout.chipSize / 2}
        tintColor={withAlpha(colors.cardFill, 0.8)}
        isInteractive
        style={styles.chip}>
        <Icon name="arrow.left" size={17} weight="medium" color={colors.ink} />
      </GlassSurface>
    </Pressable>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  const trackWidth = useSharedValue(0);
  const animatedProgress = useDerivedValue(() =>
    withTiming(progress, { duration: 450, easing: Easing.inOut(Easing.ease) }),
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: Math.max(7, trackWidth.value * animatedProgress.value),
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.track} onLayout={onLayout}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

export function LanguagePill() {
  return (
    <GlassSurface radius={15} tintColor={withAlpha(colors.cardFill, 0.8)} style={styles.languagePill}>
      <Text style={styles.flag}>🇺🇸</Text>
      <Text style={styles.language}>EN</Text>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: layout.chipSize,
    height: layout.chipSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.progressTrack,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.ink,
  },
  languagePill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  flag: {
    fontSize: 12,
  },
  language: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
});
