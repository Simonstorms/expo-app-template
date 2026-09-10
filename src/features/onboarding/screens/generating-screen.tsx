import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { createAnimatedComponent } from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import { GlassSurface } from '@/components/ui/glass';
import { content } from '@/constants/content';
import { colors, layout, withAlpha } from '@/constants/theme';

import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { useFlow } from '../hooks/use-flow';
import { useStagedProgress } from '../hooks/use-staged-progress';

const CARD_INK = '#1C1B22';
const TRACK_COLOR = '#DDDDDD';
const FILL_GRADIENT = ['#DC6A6C', '#9D8DB5', '#6F99DB'] as const;

const AnimatedGradient = createAnimatedComponent(LinearGradient);

export default function GeneratingPlanScreen() {
  const flow = useFlow('generating');
  const { advance } = flow;
  const { barStyle, value } = useStagedProgress(advance);

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <Text style={styles.percent}>{value}%</Text>
        <Text style={styles.headline}>{content.generating.headline}</Text>
        <GradientBar barStyle={barStyle} />
        <Text style={styles.caption}>{content.generating.caption}</Text>
        <View style={styles.cardWrap}>
          <GlassSurface
            style={styles.card}
            radius={12.5}
            tintColor={withAlpha(colors.cardFill, 0.85)}
          >
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

function GradientBar({ barStyle }: { barStyle: AnimatedStyle<ViewStyle> }) {
  return (
    <View style={styles.barWrap}>
      <View style={styles.barTrackContainer}>
        <View style={styles.barTrack} />
        <AnimatedGradient
          colors={FILL_GRADIENT}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.barFill, barStyle]}
        />
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
