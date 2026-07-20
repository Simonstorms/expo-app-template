import { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { content } from '@/constants/content';
import { colors, layout, text, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

function fractionForValue(value: number): number {
  'worklet';
  if (value <= 3) {
    return (value - 1) / 4;
  }
  return 0.5 + (value - 3) / 8;
}

function snappedValueForFraction(raw: number): number {
  'worklet';
  const clamped = Math.min(Math.max(raw, 0), 1);
  let continuous: number;
  if (clamped <= 0.5) {
    continuous = 1 + clamped * 4;
  } else {
    continuous = 3 + (clamped - 0.5) * 8;
  }
  return Math.min(Math.max(Math.round(continuous), 1), 7);
}

export default function QuitPaceScreen() {
  const value = useOnboarding((state) => state.reducePerWeek);
  const set = useOnboarding((state) => state.set);
  const flow = useFlow('pace');
  const { selectHaptic } = flow;

  const frac = useSharedValue(fractionForValue(value));
  const trackWidth = useSharedValue(0);
  const currentValue = useSharedValue(value);
  const pillOpacity = useSharedValue(value === 3 ? 1 : 0);

  const commit = useCallback(
    (next: number) => {
      set('reducePerWeek', next);
      selectHaptic();
    },
    [selectHaptic, set],
  );

  const applyDrag = (x: number) => {
    'worklet';
    const width = trackWidth.value;
    if (width <= 0) {
      return;
    }
    const next = snappedValueForFraction(x / width);
    if (next === currentValue.value) {
      return;
    }
    currentValue.value = next;
    frac.value = withTiming(fractionForValue(next), { duration: 120, easing: Easing.out(Easing.ease) });
    pillOpacity.value = withTiming(next === 3 ? 1 : 0, { duration: 200, easing: Easing.inOut(Easing.ease) });
    runOnJS(commit)(next);
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((event) => {
      'worklet';
      applyDrag(event.x);
    })
    .onChange((event) => {
      'worklet';
      applyDrag(event.x);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: Math.max(0, frac.value * trackWidth.value),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    left: frac.value * trackWidth.value - 15,
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
  }));

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.pace.title} />
        <View style={styles.spacer} />
        <Text style={styles.sectionLabel}>{content.pace.sectionLabel}</Text>
        <Text style={styles.bigNumber}>{value}</Text>
        <View style={styles.markerRow}>
          <Marker symbol="tortoise.fill" tint={colors.ctaFill} />
          <Marker symbol="hare.fill" tint={colors.orange} />
          <Marker symbol="bolt.fill" tint={colors.ctaFill} />
        </View>
        <View style={styles.sliderOuter}>
          <GestureDetector gesture={pan}>
            <View
              style={styles.sliderInner}
              onLayout={(event) => {
                trackWidth.value = event.nativeEvent.layout.width;
              }}>
              <View style={styles.track} />
              <Animated.View style={[styles.fill, fillStyle]} />
              <Animated.View style={[styles.knob, knobStyle]}>
                <GlassSurface
                  style={styles.knobGlass}
                  radius={15}
                  tintColor={withAlpha(colors.white, 0.92)}
                  isInteractive
                />
              </Animated.View>
            </View>
          </GestureDetector>
        </View>
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>1</Text>
          <Text style={styles.rangeLabel}>3</Text>
          <Text style={styles.rangeLabel}>7</Text>
        </View>
        <Animated.View style={[styles.pillWrap, pillStyle]}>
          <GlassSurface style={styles.pill} radius={layout.cardRadius}>
            <LinearGradient
              colors={['#ECEEF0', '#F7F3F6'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.pillGradient}
            />
            <Text style={styles.pillText}>{content.pace.recommended}</Text>
          </GlassSurface>
        </Animated.View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function Marker({ symbol, tint }: { symbol: string; tint: string }) {
  return (
    <View style={styles.marker}>
      <Icon name={symbol} size={24} color={tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 28,
  },
  sectionLabel: {
    ...text.subtitle,
    textAlign: 'center',
  },
  bigNumber: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 18,
  },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginTop: 30,
  },
  marker: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderOuter: {
    height: 30,
    paddingHorizontal: 49,
    marginTop: 13,
  },
  sliderInner: {
    flex: 1,
    height: 30,
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 13,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6E6E8',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 13,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
  knob: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  knobGlass: {
    ...StyleSheet.absoluteFill,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 29,
    marginTop: 6,
  },
  rangeLabel: {
    ...text.subtitle,
    width: 40,
    textAlign: 'center',
  },
  pillWrap: {
    marginTop: 57,
    paddingHorizontal: layout.margin,
  },
  pill: {
    height: 52,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillGradient: {
    ...StyleSheet.absoluteFill,
    opacity: 0.8,
  },
  pillText: {
    ...text.subtitle,
    textAlign: 'center',
  },
});
