import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { LanguagePill } from '../components/header';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, layout } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

const FRAME_FILL = '#1A1A1A';
const CAPTION_GRAY = '#8E8E93';
const CARD_FILL = '#F7F7F8';
const ISLAND_FILL = '#0D0508';
const RING_TRACK = '#F2F2F3';
const RING_RADIUS = 50;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RING_PROGRESS = 0.7;

export default function WelcomeScreen() {
  const { advance, goTo } = useFlow('welcome');

  return (
    <OnboardingScaffold step="welcome" ctaTitle={null}>
      <View style={styles.root}>
        <View style={styles.column}>
          <View style={{ height: 36 }} />
          <PhoneMockup />
          <View style={{ height: 50 }} />
          <Text style={styles.title}>{'Quitting snus\nmade easy'}</Text>
          <View style={{ height: 11 }} />
          <Pressable style={styles.getStartedWrap} onPress={advance}>
            <GlassSurface
              radius={layout.ctaHeight / 2}
              tintColor={colors.ink}
              fallbackColor={colors.ink}
              isInteractive
              style={styles.getStarted}>
              <Text style={styles.getStartedLabel}>Get Started</Text>
            </GlassSurface>
          </Pressable>
          <View style={{ height: 12 }} />
          <Pressable onPress={() => goTo('sign-in')}>
            <Text style={styles.signIn}>
              {'Already have an account? '}
              <Text style={styles.signInBold}>Sign In</Text>
            </Text>
          </Pressable>
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.languageWrap}>
          <LanguagePill />
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function PhoneMockup() {
  return (
    <View style={styles.phone}>
      <View style={[styles.sideButton, { height: 28.7, left: -1.7, top: 82 }]} />
      <View style={[styles.sideButton, { height: 28, left: -1.7, top: 120.7 }]} />
      <View style={[styles.sideButton, { height: 53.3, left: 221, top: 148 }]} />
      <View style={styles.phoneFrame} />
      <MockScreen />
    </View>
  );
}

function MockScreen() {
  return (
    <View style={styles.mockScreen}>
      <View style={styles.statusStrip}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusTime}>2:10</Text>
            <Icon name="bell.slash.fill" size={7} color={colors.white} />
          </View>
          <View style={styles.statusRight}>
            <Icon name="cellularbars" size={8} color={colors.white} />
            <Icon name="wifi" size={8} color={colors.white} />
            <Icon name="battery.100percent" size={10} color={colors.white} />
          </View>
        </View>
        <View style={styles.island} />
      </View>

      <View style={styles.header}>
        <Icon name="leaf.fill" size={9} weight="semibold" color={colors.ink} />
        <Text style={styles.headerText}>Quit Snus</Text>
      </View>

      <View style={styles.streakLabel}>
        <Text style={styles.streakLabelText}>YOUR STREAK</Text>
      </View>

      <StreakRing />

      <StatCard value="€48" caption="saved" left={6.65} />
      <StatCard value="84" caption="pouches avoided" left={110.65} />

      <View style={styles.milestoneCard}>
        <Text style={styles.milestoneTitle}>Next milestone</Text>
        <Text style={styles.milestoneSub}>2 weeks · tomorrow</Text>
      </View>
    </View>
  );
}

function StreakRing() {
  return (
    <View style={styles.ringWrap}>
      <Svg width={110} height={110}>
        <Circle cx={55} cy={55} r={RING_RADIUS} stroke={RING_TRACK} strokeWidth={10} fill="none" />
        <Circle
          cx={55}
          cy={55}
          r={RING_RADIUS}
          stroke={colors.ink}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={[RING_CIRCUMFERENCE * RING_PROGRESS, RING_CIRCUMFERENCE]}
          originX={55}
          originY={55}
          rotation={-90}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringValue}>12</Text>
        <Text style={styles.ringCaption}>days snus-free</Text>
      </View>
    </View>
  );
}

function StatCard({ value, caption, left }: { value: string; caption: string; left: number }) {
  return (
    <View style={[styles.statCard, { left }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statCaption} numberOfLines={1}>
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: colors.ink,
  },
  getStartedWrap: {
    alignSelf: 'stretch',
    marginHorizontal: layout.ctaMargin,
  },
  getStarted: {
    height: layout.ctaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  signIn: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.ink,
  },
  signInBold: {
    fontWeight: '700',
  },
  languageWrap: {
    position: 'absolute',
    top: 15,
    right: 16,
  },
  phone: {
    width: 223.3,
    height: 458.7,
  },
  sideButton: {
    position: 'absolute',
    width: 4,
    borderRadius: 2,
    backgroundColor: FRAME_FILL,
  },
  phoneFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 223.3,
    height: 458.7,
    borderRadius: 33,
    backgroundColor: FRAME_FILL,
  },
  mockScreen: {
    position: 'absolute',
    left: 7,
    top: 7,
    width: 209.3,
    height: 444.7,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  statusStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 209.3,
    height: 27,
    backgroundColor: colors.ink,
  },
  statusRow: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingLeft: 8,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingRight: 8,
  },
  statusTime: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  island: {
    position: 'absolute',
    left: 61.8,
    top: 3.5,
    width: 85.7,
    height: 20,
    borderRadius: 10,
    backgroundColor: ISLAND_FILL,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 31,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  streakLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 53,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakLabelText: {
    fontSize: 7,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: CAPTION_GRAY,
  },
  ringWrap: {
    position: 'absolute',
    left: 49.65,
    top: 95,
    width: 110,
    height: 110,
  },
  ringCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  ringValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.ink,
  },
  ringCaption: {
    fontSize: 9,
    fontWeight: '400',
    color: CAPTION_GRAY,
  },
  statCard: {
    position: 'absolute',
    top: 230,
    width: 92,
    height: 64,
    borderRadius: 14,
    backgroundColor: CARD_FILL,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  statCaption: {
    fontSize: 8,
    fontWeight: '400',
    color: CAPTION_GRAY,
  },
  milestoneCard: {
    position: 'absolute',
    left: 6.65,
    top: 310,
    width: 196,
    height: 52,
    borderRadius: 14,
    backgroundColor: CARD_FILL,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 3,
  },
  milestoneTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.ink,
  },
  milestoneSub: {
    fontSize: 8,
    fontWeight: '400',
    color: CAPTION_GRAY,
  },
});
