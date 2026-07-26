import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { motion } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  scaleTo = 0.97,
  style,
  onPressIn,
  onPressOut,
  ...props
}: Omit<PressableProps, 'style'> & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event: GestureResponderEvent) => {
        scale.set(withTiming(scaleTo, { duration: motion.pressIn, easing: motion.easeOut }));
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        scale.set(withTiming(1, { duration: motion.pressOut, easing: motion.easeOut }));
        onPressOut?.(event);
      }}
      style={[animatedStyle, style]}
    />
  );
}
