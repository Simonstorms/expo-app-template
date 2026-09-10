import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icon';
import { colors, layout, text, withAlpha } from '@/constants/theme';

export function SelectionRow({
  title,
  caption,
  symbol,
  emoji,
  leading,
  trailing,
  height = 69,
  centered = false,
  iconCircleSize = 34,
  showRadio = false,
  selected,
  onPress,
}: {
  title: string;
  caption?: string;
  symbol?: IconName;
  emoji?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  height?: number;
  centered?: boolean;
  iconCircleSize?: number;
  showRadio?: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useDerivedValue(() =>
    withSpring(selected ? 1.015 : 1, { damping: 15, stiffness: 220 }),
  );
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const radio = showRadio && !centered;
  const stretch = radio || trailing !== undefined;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={caption ? `${title}, ${caption}` : title}
        accessibilityState={{ selected }}
      >
        <GlassSurface
          radius={layout.cardRadius}
          tintColor={selected ? colors.ink : withAlpha(colors.cardFill, 0.85)}
          isInteractive
        >
          <View
            style={[
              styles.content,
              centered ? styles.contentCentered : styles.contentLeading,
              { minHeight: height },
            ]}
          >
            <RowLeading
              leading={leading}
              emoji={emoji}
              symbol={symbol}
              iconCircleSize={iconCircleSize}
              selected={selected}
            />
            <View
              style={[
                styles.textBlock,
                centered ? styles.textCentered : styles.textLeading,
                stretch ? styles.stretch : null,
              ]}
            >
              <Text style={[text.row, selected ? styles.titleSelected : styles.title]}>
                {title}
              </Text>
              {caption ? (
                <Text style={[text.caption, selected ? styles.captionSelected : styles.caption]}>
                  {caption}
                </Text>
              ) : null}
            </View>
            {trailing ?? null}
            {radio && !trailing ? <Radio selected={selected} /> : null}
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

function RowLeading({
  leading,
  emoji,
  symbol,
  iconCircleSize,
  selected,
}: {
  leading?: ReactNode;
  emoji?: string;
  symbol?: IconName;
  iconCircleSize: number;
  selected: boolean;
}) {
  if (leading) {
    return leading;
  }
  if (emoji) {
    return <Text style={styles.emoji}>{emoji}</Text>;
  }
  if (symbol) {
    return <IconCircle symbol={symbol} size={iconCircleSize} selected={selected} />;
  }
  return null;
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
      {selected ? <Icon name="checkmark" size={12} weight="bold" color={colors.ink} /> : null}
    </View>
  );
}

function IconCircle({
  symbol,
  size,
  selected,
}: {
  symbol: IconName;
  size: number;
  selected: boolean;
}) {
  return (
    <View
      style={[
        styles.iconCircle,
        selected ? styles.iconCircleSelected : styles.iconCircleDefault,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Icon
        name={symbol}
        size={size * 0.42}
        weight="semibold"
        color={selected ? colors.ink : colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
  },
  contentCentered: {
    justifyContent: 'center',
  },
  contentLeading: {
    justifyContent: 'flex-start',
  },
  textBlock: {
    gap: 5,
  },
  textCentered: {
    alignItems: 'center',
  },
  textLeading: {
    alignItems: 'flex-start',
  },
  stretch: {
    flex: 1,
  },
  title: {
    color: colors.ink,
  },
  titleSelected: {
    color: colors.white,
  },
  caption: {
    color: withAlpha(colors.ink, 0.8),
  },
  captionSelected: {
    color: withAlpha(colors.white, 0.75),
  },
  emoji: {
    fontSize: 22,
    width: 26,
    textAlign: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  radioOff: {
    backgroundColor: colors.transparent,
    borderColor: colors.ring,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: colors.white,
  },
  iconCircleDefault: {
    backgroundColor: colors.ink,
  },
});
