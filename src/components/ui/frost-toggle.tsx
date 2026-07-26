import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, withAlpha } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const trackOff = withAlpha(colors.ink, 0.12);

export function FrostToggle({
  value,
  onToggle,
  accessibilityLabel,
}: {
  value: boolean;
  onToggle: () => void;
  accessibilityLabel?: string;
}) {
  const progress = useDerivedValue(() => withTiming(value ? 1 : 0, { duration: 180 }));
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [trackOff, colors.success]),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(value ? 20 : 0, { damping: 18, stiffness: 260 }) }],
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      style={[styles.track, trackStyle]}
    >
      <Animated.View style={[styles.knob, knobStyle]} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 2,
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
