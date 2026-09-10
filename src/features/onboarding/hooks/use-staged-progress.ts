import { useEffect, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type Stage = {
  to: number;
  duration: number;
  pause?: number;
  surge?: boolean;
};

const STAGES: Stage[] = [
  { to: 14, duration: 350, surge: true },
  { to: 26, duration: 620, pause: 150 },
  { to: 52, duration: 380, pause: 220, surge: true },
  { to: 61, duration: 640 },
  { to: 86, duration: 360, pause: 260, surge: true },
  { to: 94, duration: 700 },
  { to: 100, duration: 300, pause: 200, surge: true },
];

const surgeEasing = Easing.out(Easing.cubic);
const crawlEasing = Easing.inOut(Easing.quad);

export function useStagedProgress(onComplete: () => void, holdMs = 450) {
  const progress = useSharedValue(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const steps = STAGES.map((stage) => {
      const timing = withTiming(stage.to, {
        duration: stage.duration,
        easing: stage.surge ? surgeEasing : crawlEasing,
      });
      return stage.pause ? withDelay(stage.pause, timing) : timing;
    });
    const finish = withDelay(
      holdMs,
      withTiming(100, { duration: 1 }, (finished) => {
        if (finished) {
          scheduleOnRN(onComplete);
        }
      }),
    );
    progress.value = withSequence(...steps, finish);
    return () => cancelAnimation(progress);
  }, [holdMs, onComplete, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, progress.value)}%`,
  }));

  useAnimatedReaction(
    () => Math.min(100, Math.round(progress.value)),
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(setValue, current);
      }
    },
  );

  return { barStyle, value };
}
