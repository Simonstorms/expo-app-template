import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const CARD_INK = '#1C1B22';
const TRACK_COLOR = '#DDDDDD';
const FILL_GRADIENT = ['#DC6A6C', '#9D8DB5', '#6F99DB'] as const;
const PAUSE_THRESHOLDS = [23, 46, 68, 87];

export default function GeneratingPlanScreen() {
  const flow = useFlow('generating');
  const { advance } = flow;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let current = 0;
    const pauses = [...PAUSE_THRESHOLDS];

    const tick = () => {
      if (cancelled) return;
      const next = Math.min(100, current + (0.8 + Math.random() * 0.8));
      current = next;
      setProgress(next);

      if (next >= 100) {
        timeoutId = setTimeout(() => {
          if (!cancelled) advance();
        }, 500);
        return;
      }

      let delay = 40;
      if (pauses.length > 0 && next >= pauses[0]) {
        pauses.shift();
        delay += 250 + Math.random() * 200;
      }
      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, 40);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [advance]);

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <Text style={styles.percent}>{Math.floor(progress)}%</Text>
        <Text style={styles.headline}>{content.generating.headline}</Text>
        <GradientBar progress={progress} />
        <Text style={styles.caption}>{content.generating.caption}</Text>
        <View style={styles.cardWrap}>
          <GlassSurface style={styles.card} radius={12.5} tintColor={withAlpha(colors.cardFill, 0.85)}>
            <Text style={styles.cardTitle}>{content.generating.cardTitle}</Text>
            {content.generating.bullets.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </GlassSurface>
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function GradientBar({ progress }: { progress: number }) {
  const [trackWidth, setTrackWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const fillWidth = trackWidth > 0 ? Math.max(10, (trackWidth * progress) / 100) : 0;

  return (
    <View style={styles.barWrap}>
      <View style={styles.barTrackContainer} onLayout={onLayout}>
        <View style={styles.barTrack} />
        {fillWidth > 0 ? (
          <LinearGradient
            colors={FILL_GRADIENT}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.barFill, { width: fillWidth }]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  percent: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.ctaFill,
    paddingTop: 125,
    fontVariant: ['tabular-nums'],
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.ctaFill,
    textAlign: 'center',
    paddingTop: 7,
  },
  caption: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.ink,
    paddingTop: 25,
  },
  barWrap: {
    width: '100%',
    paddingHorizontal: layout.margin,
    paddingTop: 31,
  },
  barTrackContainer: {
    height: 10,
    justifyContent: 'center',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: TRACK_COLOR,
  },
  barFill: {
    position: 'absolute',
    left: 0,
    height: 10,
    borderRadius: 5,
  },
  cardWrap: {
    width: '100%',
    paddingHorizontal: layout.margin,
    paddingTop: 40,
  },
  card: {
    borderRadius: 12.5,
    alignItems: 'flex-start',
    paddingTop: 27,
    paddingBottom: 28,
    gap: 7,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: CARD_INK,
    paddingLeft: 15,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingLeft: 14,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: CARD_INK,
  },
  bulletText: {
    fontSize: 17,
    fontWeight: '400',
    color: CARD_INK,
  },
  spacer: {
    flex: 1,
    minHeight: 0,
  },
});
