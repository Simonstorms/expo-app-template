import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
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
  symbol?: string;
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
              { minHeight: height, justifyContent: centered ? 'center' : 'flex-start' },
            ]}
          >
            {leading ?? null}
            {!leading && emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
            {!leading && !emoji && symbol ? (
              <IconCircle symbol={symbol} size={iconCircleSize} selected={selected} />
            ) : null}
            <View
              style={[
                { alignItems: centered ? 'center' : 'flex-start', gap: 5 },
                stretch ? styles.stretch : null,
              ]}
            >
              <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>
                {title}
              </Text>
              {caption ? (
                <Text
                  style={[
                    text.caption,
                    {
                      color: selected ? withAlpha(colors.white, 0.75) : withAlpha(colors.ink, 0.8),
                    },
                  ]}
                >
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

function Radio({ selected }: { selected: boolean }) {
  return (
    <View
      style={[
        styles.radio,
        selected
          ? { backgroundColor: colors.white, borderColor: colors.white }
          : { backgroundColor: 'transparent', borderColor: colors.ring },
      ]}
    >
      {selected ? <Icon name="checkmark" size={12} weight="bold" color={colors.ink} /> : null}
    </View>
  );
}

function IconCircle({
  symbol,
  size,
  selected,
}: {
  symbol: string;
  size: number;
  selected: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? colors.white : colors.ink,
      }}
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
  stretch: {
    flex: 1,
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
});
