import { getLocales } from 'expo-localization';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { motion } from '@/constants/motion';
import { colors, layout, withAlpha } from '@/constants/theme';

export type ChipTone = 'light' | 'translucent';

const MIN_FILL_WIDTH = 7;
const REGIONAL_INDICATOR_BASE = 0x1_f1_e6;
const LETTER_A = 'A'.codePointAt(0) ?? 65;

function regionFlag(regionCode: string | null): string {
  if (regionCode === null || regionCode.length !== 2) {
    return '🌐';
  }
  const upper = regionCode.toUpperCase();
  const first = upper.codePointAt(0) ?? LETTER_A;
  const second = upper.codePointAt(1) ?? LETTER_A;
  return String.fromCodePoint(
    REGIONAL_INDICATOR_BASE + (first - LETTER_A),
    REGIONAL_INDICATOR_BASE + (second - LETTER_A),
  );
}

let lastProgress = 0;

export function BackChip({
  onPress,
  tone = 'light',
  label = 'Back',
}: {
  onPress: () => void;
  tone?: ChipTone;
  label?: string;
}) {
  const fill =
    tone === 'translucent' ? withAlpha(colors.white, 0.55) : withAlpha(colors.cardFill, 0.8);

  return (
    <Pressable onPress={onPress} hitSlop={10} accessibilityRole="button" accessibilityLabel={label}>
      <GlassSurface
        radius={layout.chipSize / 2}
        tintColor={fill}
        fallbackColor={fill}
        isInteractive
        style={styles.chip}
      >
        <Icon name="arrow.left" size={17} weight="medium" color={colors.ink} />
      </GlassSurface>
    </Pressable>
  );
}

export function ProgressBar({ progress }: { progress: number }) {
  const trackWidth = useSharedValue(0);
  const fill = useSharedValue(lastProgress);

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.set(event.nativeEvent.layout.width);
    lastProgress = progress;
    fill.set(withTiming(progress, { duration: motion.enter, easing: motion.easeOut }));
  };

  const fillStyle = useAnimatedStyle(() => {
    const width = trackWidth.get();
    const scaleX = width > 0 ? Math.min(1, Math.max(MIN_FILL_WIDTH / width, fill.get())) : 0;
    return {
      opacity: width > 0 ? 1 : 0,
      transform: [{ translateX: -width / 2 }, { scaleX }, { translateX: width / 2 }],
    };
  });

  return (
    <View
      style={styles.track}
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

export function SkipLink({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.skip}>{label}</Text>
    </Pressable>
  );
}

export function LanguagePill() {
  const [locale] = getLocales();
  const flag = regionFlag(locale?.regionCode ?? null);
  const language = (locale?.languageCode ?? 'en').toUpperCase();

  return (
    <GlassSurface
      radius={15}
      tintColor={withAlpha(colors.cardFill, 0.8)}
      style={styles.languagePill}
    >
      <Text style={styles.flag}>{flag}</Text>
      <Text style={styles.language}>{language}</Text>
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
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.ink,
  },
  skip: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.tertiaryText,
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
