import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { colors } from '@/constants/theme';

const fillTiming = { duration: 300, easing: Easing.out(Easing.cubic) };
const markTiming = { duration: 200, easing: Easing.out(Easing.quad) };
const markExitTiming = { duration: 120, easing: Easing.out(Easing.quad) };
const MARK_DELAY_MS = 70;

export function StepCheck({
  done,
  size = 26,
  tint = colors.success,
}: {
  done: boolean;
  size?: number;
  tint?: string;
}) {
  const radius = size / 2;

  const ringStyle = useAnimatedStyle(() => ({
    opacity: withTiming(done ? 0 : 1, fillTiming),
  }));

  const fillStyle = useAnimatedStyle(() => ({
    opacity: withTiming(done ? 1 : 0, fillTiming),
    transform: [{ scale: withTiming(done ? 1 : 0.7, fillTiming) }],
  }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: done
      ? withDelay(MARK_DELAY_MS, withTiming(1, markTiming))
      : withTiming(0, markExitTiming),
    transform: [{ scale: withTiming(done ? 1 : 0.6, fillTiming) }],
  }));

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.layer,
          { borderRadius: radius, borderWidth: 1.5, borderColor: colors.ring },
          ringStyle,
        ]}
      />
      <Animated.View
        style={[styles.layer, { borderRadius: radius, backgroundColor: tint }, fillStyle]}
      />
      <Animated.View style={markStyle}>
        <Icon name="checkmark" size={Math.round(size * 0.46)} weight="bold" color={colors.white} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
