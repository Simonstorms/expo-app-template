import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { colors, layout, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';
import { usePlan } from '../hooks/use-plan';

const nearInk = '#0A0A0A';
const subtitleGray = '#959499';
const chipFill = '#F7F7FB';
const ringTrack = '#EFF1F5';
const ringOrange = '#DE9B6C';
const ringRed = '#DC6868';
const ringBlue = '#6996DA';
const badgeFill = '#050505';

const RING_SIZE = 64.3;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CENTER = RING_SIZE / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function PlanReadyScreen() {
  const { goalDate, dailyLimit, moneySaved } = usePlan();
  const { advance } = useFlow('plan-ready');
  const insets = useSafeAreaInsets();

  return (
    <OnboardingScaffold step="plan-ready" ctaTitle={null}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.checkBadge}>
            <Icon name="checkmark" size={15} weight="bold" color={colors.white} />
          </View>
          <Text style={styles.headline}>{'Congratulations\nyour custom plan is ready!'}</Text>
          <Text style={styles.subhead}>You should be snus-free by:</Text>
          <GlassSurface
            radius={49 / 2}
            tintColor={withAlpha(colors.cardFill, 0.85)}
            style={styles.goalPill}>
            <Text style={styles.goalPillText}>{`Snus-free by ${goalDate}`}</Text>
          </GlassSurface>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily recommendation</Text>
            <Text style={styles.cardSubtitle}>You can edit this anytime</Text>
            <View style={styles.tileGrid}>
              <View style={styles.tileRow}>
                <MetricTile
                  symbol="capsule.portrait.fill"
                  iconTint={colors.ink}
                  label="Daily limit"
                  value={dailyLimit}
                  unit="pouches"
                  ringColor={colors.ink}
                />
                <MetricTile
                  symbol="banknote.fill"
                  iconTint={ringOrange}
                  label="Money saved"
                  value={moneySaved}
                  ringColor={ringOrange}
                />
              </View>
              <View style={styles.tileRow}>
                <MetricTile
                  symbol="brain.fill"
                  iconTint={ringRed}
                  label="Craving level"
                  value="Low"
                  ringColor={ringRed}
                />
                <MetricTile
                  symbol="heart.fill"
                  iconTint={ringBlue}
                  label="Health score"
                  value="7/10"
                  ringColor={ringBlue}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomBar} pointerEvents="box-none">
          <LinearGradient
            colors={[withAlpha(colors.white, 0), colors.white] as const}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.bottomFade}
            pointerEvents="none"
          />
          <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + 8 }]}>
            <PrimaryCTA title="Let's get started!" onPress={advance} />
          </View>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function MetricTile({
  symbol,
  iconTint,
  label,
  value,
  unit,
  ringColor,
}: {
  symbol: string;
  iconTint: string;
  label: string;
  value: string;
  unit?: string;
  ringColor: string;
}) {
  return (
    <GlassSurface
      radius={20}
      tintColor={withAlpha(colors.white, 0.85)}
      style={styles.tile}>
      <View style={styles.tileContent}>
        <View style={styles.tileTopRow}>
          <View style={styles.iconCircle}>
            <Icon name={symbol} size={12} weight="semibold" color={iconTint} />
          </View>
          <Text
            style={styles.tileLabel}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {label}
          </Text>
        </View>
        <View style={styles.ring}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_CENTER}
              cy={RING_CENTER}
              r={RING_RADIUS}
              stroke={ringTrack}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <Circle
              cx={RING_CENTER}
              cy={RING_CENTER}
              r={RING_RADIUS}
              stroke={ringColor}
              strokeWidth={RING_STROKE}
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={[RING_CIRCUMFERENCE * 0.5, RING_CIRCUMFERENCE]}
              originX={RING_CENTER}
              originY={RING_CENTER}
              rotation={-90}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringValue}>{value}</Text>
            {unit ? <Text style={styles.ringUnit}>{unit}</Text> : null}
          </View>
        </View>
      </View>
      <View style={styles.pencil} pointerEvents="none">
        <Icon name="pencil" size={13} weight="bold" color={colors.ink} />
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  checkBadge: {
    marginTop: 54,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: badgeFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.ink,
    textAlign: 'center',
  },
  subhead: {
    marginTop: 34,
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  goalPill: {
    marginTop: 10,
    alignSelf: 'center',
    height: 49,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPillText: {
    fontSize: 17,
    fontWeight: '600',
    color: nearInk,
  },
  card: {
    marginTop: 32,
    alignSelf: 'stretch',
    marginHorizontal: layout.margin,
    paddingTop: 18,
    paddingHorizontal: 19,
    paddingBottom: 19,
    borderRadius: 13,
    backgroundColor: colors.cardFill,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: nearInk,
  },
  cardSubtitle: {
    marginTop: 5,
    fontSize: 19,
    fontWeight: '400',
    color: subtitleGray,
  },
  tileGrid: {
    marginTop: 34,
    gap: 18.7,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 14,
  },
  tile: {
    flex: 1,
    height: 123.7,
  },
  tileContent: {
    flex: 1,
    paddingTop: 9.7,
    alignItems: 'center',
    gap: 10,
  },
  tileTopRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    marginLeft: 9.3,
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: chipFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    flex: 1,
    marginRight: 8,
    fontSize: 17,
    fontWeight: '500',
    color: nearInk,
    textAlign: 'center',
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  ringUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  pencil: {
    position: 'absolute',
    right: 8.3,
    bottom: 8.7,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomFade: {
    height: 150,
  },
  ctaWrap: {
    paddingHorizontal: layout.ctaMargin,
    backgroundColor: colors.white,
  },
});
