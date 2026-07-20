import { useCallback, useMemo, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { formatMoney } from '@/constants/brand';
import { colors, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const RANGE_MIN = 0;
const RANGE_MAX = 200;
const STEP = 0.5;
const STEP_SPACING = 9;
const POINTS_PER_UNIT = STEP_SPACING / STEP;
const RULER_HEIGHT = 70;
const BAND_COLOR = '#E3E3E3';
const MINOR_TICK_COLOR = '#767676';
const MAJOR_TICK_COLOR = '#323232';

type Tick = {
  index: number;
  x: number;
  tickHeight: number;
  tickWidth: number;
  opacity: number;
  color: string;
};

function buildTicks(width: number, value: number): Tick[] {
  if (width <= 0) return [];
  const centerX = width / 2;
  const halfSpan = (centerX + STEP_SPACING) / POINTS_PER_UNIT;
  const lowestVisible = Math.max(RANGE_MIN, value - halfSpan);
  const highestVisible = Math.min(RANGE_MAX, value + halfSpan);
  const lowerIndex = Math.ceil(lowestVisible / STEP);
  const upperIndex = Math.floor(highestVisible / STEP);
  const ticks: Tick[] = [];
  for (let index = lowerIndex; index <= upperIndex; index += 1) {
    const tickValue = index * STEP;
    const x = centerX + (tickValue - value) * POINTS_PER_UNIT;
    const isMajor = index % 10 === 0;
    const edgeDistance = Math.min(x, width - x);
    ticks.push({
      index,
      x,
      tickHeight: isMajor ? 50 : 30,
      tickWidth: isMajor ? 1 : 0.8,
      opacity: Math.max(0, Math.min(1, edgeDistance / 28)),
      color: isMajor ? MAJOR_TICK_COLOR : MINOR_TICK_COLOR,
    });
  }
  return ticks;
}

export default function WeeklySpendScreen() {
  const weeklySpend = useOnboarding((state) => state.weeklySpend);
  const set = useOnboarding((state) => state.set);
  const flow = useFlow('weekly-spend');
  const { selectHaptic } = flow;

  const commit = useCallback((value: number) => set('weeklySpend', value), [set]);

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.weeklySpend.title} />
        <View style={styles.spacer} />
        <View style={styles.block}>
          <Text style={styles.label}>{content.weeklySpend.label}</Text>
          <Text style={styles.value}>{formatMoney(weeklySpend, 1)}</Text>
          <View style={styles.rulerWrap}>
            <SpendRuler value={weeklySpend} onChange={commit} onSelectHaptic={selectHaptic} />
          </View>
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function SpendRuler({
  value,
  onChange,
  onSelectHaptic,
}: {
  value: number;
  onChange: (value: number) => void;
  onSelectHaptic: () => void;
}) {
  const [width, setWidth] = useState(0);
  const current = useSharedValue(value);
  const dragBase = useSharedValue(0);

  const commit = useCallback(
    (next: number) => {
      onChange(next);
      onSelectHaptic();
    },
    [onChange, onSelectHaptic],
  );

  const beginDrag = () => {
    'worklet';
    dragBase.value = current.value;
  };

  const applyDrag = (translationX: number) => {
    'worklet';
    const raw = dragBase.value - translationX / POINTS_PER_UNIT;
    const clamped = Math.min(Math.max(raw, RANGE_MIN), RANGE_MAX);
    const stepped = Math.round(clamped / STEP) * STEP;
    if (stepped === current.value) {
      return;
    }
    current.value = stepped;
    runOnJS(commit)(stepped);
  };

  const pan = Gesture.Pan()
    .minDistance(1)
    .onBegin(() => {
      'worklet';
      beginDrag();
    })
    .onChange((event) => {
      'worklet';
      applyDrag(event.translationX);
    });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const ticks = useMemo(() => buildTicks(width, value), [width, value]);
  const centerX = width / 2;

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.ruler} onLayout={onLayout}>
        {width > 0 ? (
          <>
            <GlassSurface
              radius={0}
              tintColor={withAlpha(BAND_COLOR, 0.9)}
              style={[styles.band, { width: centerX }]}
            />
            <Svg width={width} height={RULER_HEIGHT} style={styles.tape}>
              {ticks.map((tick) => (
                <Rect
                  key={tick.index}
                  x={tick.x - tick.tickWidth / 2}
                  y={RULER_HEIGHT - tick.tickHeight}
                  width={tick.tickWidth}
                  height={tick.tickHeight}
                  fill={tick.color}
                  opacity={tick.opacity}
                />
              ))}
              <Rect x={centerX - 1} y={0} width={2} height={RULER_HEIGHT} fill={colors.ink} />
            </Svg>
          </>
        ) : null}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  block: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 34,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.ink,
  },
  value: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.ink,
    paddingTop: 20,
  },
  rulerWrap: {
    width: '100%',
    paddingTop: 20,
  },
  ruler: {
    width: '100%',
    height: RULER_HEIGHT,
  },
  band: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  tape: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
