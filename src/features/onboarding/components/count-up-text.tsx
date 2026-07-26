import { useRef, useState } from 'react';
import { type StyleProp, Text, type TextStyle } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export function CountUpText({
  target,
  format,
  style,
  duration = 1400,
  delay = 350,
}: {
  target: number;
  format: (value: string) => string;
  style?: StyleProp<TextStyle>;
  duration?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  const progress = useSharedValue(0);
  const started = useRef<true | null>(null);

  if (started.current == null) {
    started.current = true;
    progress.value = withDelay(
      delay,
      withTiming(target, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }

  useAnimatedReaction(
    () => Math.round(progress.value),
    (value, previous) => {
      if (value !== previous) {
        runOnJS(setDisplay)(value);
      }
    },
  );

  return <Text style={style}>{format(String(display))}</Text>;
}
