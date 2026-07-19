import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { colors, layout, text, withAlpha } from '@/constants/theme';

export function SelectionRow({
  title,
  caption,
  symbol,
  height = 69,
  centered = false,
  iconCircleSize = 34,
  selected,
  onPress,
}: {
  title: string;
  caption?: string;
  symbol?: string;
  height?: number;
  centered?: boolean;
  iconCircleSize?: number;
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
          <View
            style={[
              styles.content,
              { minHeight: height, justifyContent: centered ? 'center' : 'flex-start' },
            ]}>
            {symbol ? (
              <IconCircle symbol={symbol} size={iconCircleSize} selected={selected} />
            ) : null}
            <View style={{ alignItems: centered ? 'center' : 'flex-start', gap: 5 }}>
              <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>{title}</Text>
              {caption ? (
                <Text
                  style={[
                    text.caption,
                    { color: selected ? withAlpha(colors.white, 0.75) : withAlpha(colors.ink, 0.8) },
                  ]}>
                  {caption}
                </Text>
              ) : null}
            </View>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

export function IconCircle({
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
      }}>
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
});
