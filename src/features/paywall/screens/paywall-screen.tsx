import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { colors, layout, withAlpha } from '@/constants/theme';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { restorePurchases } from '../api';

const mock = {
  frameFill: '#181818',
  screenTop: '#E1E0E3',
  bigTrack: '#EFEEF6',
  miniTrack: '#F0EFF5',
  red: '#E15B60',
  orange: '#E08A3C',
  blue: '#5B8BE0',
  secondary: '#6B7280',
  rowFill: '#FAFAFC',
  statText: '#333333',
} as const;

export default function PaywallScreen() {
  const flow = useFlow('paywall');

  const footer = (
    <View>
      <View style={styles.paymentRow}>
        <Icon name="checkmark" size={17} weight="heavy" color={colors.ink} />
        <Text style={styles.paymentText}>No Payment Due Now</Text>
      </View>
      <View style={styles.continueWrap}>
        <Pressable onPress={flow.finish} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
          <GlassSurface
            style={styles.continueButton}
            radius={16}
            tintColor={colors.ink}
            fallbackColor={colors.ink}
            isInteractive>
            <Text style={styles.continueLabel}>Continue</Text>
          </GlassSurface>
        </Pressable>
      </View>
      <Text style={styles.priceCaption}>Just 29,99 € per year (2,49 €/mo)</Text>
    </View>
  );

  return (
    <OnboardingScaffold step="paywall" ctaTitle={null} footer={footer}>
      <View style={styles.content}>
        <View style={styles.restoreRow}>
          <Pressable
            onPress={() => {
              void restorePurchases();
            }}>
            <Text style={styles.restoreText}>Restore</Text>
          </Pressable>
        </View>
        <Text
          style={styles.headline}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.9}>
          Unlock Quit Snus to reach your goals faster.
        </Text>
        <View style={styles.mockWrap}>
          <PhoneMockup />
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function PhoneMockup() {
  return (
    <View style={styles.phoneFrame}>
      <View style={[styles.sideButton, { height: 42.3, left: -3.5, top: 72.3 }]} />
      <View style={[styles.sideButton, { height: 40.7, left: -3.5, top: 121.7 }]} />
      <View style={[styles.sideButton, { height: 72.7, left: 275.8, top: 156.3 }]} />
      <View style={styles.phoneBody} />
      <View style={styles.dashboardWrap}>
        <Dashboard />
      </View>
      <View style={styles.notch} />
    </View>
  );
}

function Dashboard() {
  return (
    <View style={styles.dashboard}>
      <LinearGradient
        colors={[mock.screenTop, colors.white]}
        locations={[0, 0.52]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.dashHeader}>
        <Icon name="leaf.fill" size={16} weight="bold" color="#1F1B23" />
        <Text style={styles.brandText}>Quit Snus</Text>
      </View>
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Today</Text>
        <Text style={styles.tabInactive}>Yesterday</Text>
      </View>
      <View style={styles.tabDot} />
      <GlassSurface style={styles.bigCard} radius={11} tintColor={withAlpha(colors.white, 0.85)}>
        <View style={styles.bigRing}>
          <MockRing
            diameter={62.7}
            lineWidth={6}
            track={mock.bigTrack}
            tint="#111111"
            sweep={100 / 360}
            innerDisc={36}>
            <Icon name="leaf.fill" size={11} weight="semibold" color={colors.ink} />
          </MockRing>
        </View>
        <View style={styles.bigText}>
          <Text style={styles.bigValue}>12</Text>
          <Text style={styles.bigLabel}>Days snus-free</Text>
        </View>
      </GlassSurface>
      <View style={styles.miniRow}>
        <MiniStatCard
          value="4"
          label="Pouches left"
          tint={mock.red}
          sweep={95 / 360}
          icon={<View style={styles.pouchIcon} />}
        />
        <MiniStatCard
          value="45,00 €"
          label="Saved"
          tint={mock.orange}
          sweep={80 / 360}
          icon={<Icon name="eurosign" size={9} weight="bold" color={mock.orange} />}
        />
        <MiniStatCard
          value="92%"
          label="Health"
          tint={mock.blue}
          sweep={115 / 360}
          icon={<Icon name="heart.fill" size={9} color={mock.blue} />}
        />
      </View>
      <Text style={styles.recentText}>Recent check-ins</Text>
      <GlassSurface style={styles.checkInRow} radius={10} tintColor={withAlpha(mock.rowFill, 0.9)}>
        <View style={styles.checkImage}>
          <LinearGradient
            colors={['#C7BFB4', '#94897C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Icon name="cup.and.saucer.fill" size={22} color={withAlpha(colors.white, 0.9)} />
        </View>
        <View style={styles.checkBody}>
          <View style={styles.checkTitleRow}>
            <Text style={styles.checkTitle} numberOfLines={1}>
              Craving resisted at work
            </Text>
            <View style={styles.flexFill} />
            <View style={styles.timePill}>
              <Text style={styles.timeText}>14:10</Text>
            </View>
          </View>
          <View style={styles.gap8} />
          <View style={styles.checkStatRow}>
            <Icon name="flame.fill" size={9} color={colors.ink} />
            <Text style={styles.checkStatText}>3 cravings resisted</Text>
          </View>
          <View style={styles.gap9} />
          <View style={styles.checkMiniRow}>
            <MiniInline symbol="flame.fill" tint={mock.red} text="3 urges" />
            <MiniInline symbol="clock.fill" tint={mock.orange} text="45 min" />
            <MiniInline symbol="drop.fill" tint={mock.blue} text="0 used" />
          </View>
        </View>
      </GlassSurface>
    </View>
  );
}

function MiniStatCard({
  value,
  label,
  tint,
  sweep,
  icon,
}: {
  value: string;
  label: string;
  tint: string;
  sweep: number;
  icon: ReactNode;
}) {
  return (
    <GlassSurface style={styles.miniCard} radius={10} tintColor={withAlpha(colors.white, 0.85)}>
      <View style={styles.miniRing}>
        <MockRing diameter={35.7} lineWidth={4} track={mock.miniTrack} tint={tint} sweep={sweep}>
          {icon}
        </MockRing>
      </View>
      <View style={styles.miniText}>
        <Text style={styles.miniValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {value}
        </Text>
        <Text style={styles.miniLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9}>
          {label}
        </Text>
      </View>
    </GlassSurface>
  );
}

function MiniInline({ symbol, tint, text }: { symbol: string; tint: string; text: string }) {
  return (
    <View style={styles.miniInline}>
      <Icon name={symbol} size={8} color={tint} />
      <Text style={styles.miniInlineText}>{text}</Text>
    </View>
  );
}

function MockRing({
  diameter,
  lineWidth,
  track,
  tint,
  sweep,
  innerDisc,
  children,
}: {
  diameter: number;
  lineWidth: number;
  track: string;
  tint: string;
  sweep: number;
  innerDisc?: number;
  children: ReactNode;
}) {
  const center = diameter / 2;
  const radius = (diameter - lineWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[styles.ringStage, { width: diameter, height: diameter }]}>
      {innerDisc !== undefined ? (
        <View
          style={{
            position: 'absolute',
            width: innerDisc,
            height: innerDisc,
            borderRadius: innerDisc / 2,
            backgroundColor: mock.rowFill,
          }}
        />
      ) : null}
      <Svg width={diameter} height={diameter} style={StyleSheet.absoluteFill}>
        <Circle cx={center} cy={center} r={radius} stroke={track} strokeWidth={lineWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={tint}
          strokeWidth={lineWidth}
          strokeLinecap="butt"
          fill="none"
          strokeDasharray={[circumference * sweep, circumference]}
          originX={center}
          originY={center}
          rotation={-90}
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  restoreRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingRight: 17,
  },
  restoreText: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    color: colors.ink,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  mockWrap: {
    paddingTop: 26,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  continueWrap: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 20,
  },
  continueButton: {
    height: 63.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLabel: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.white,
  },
  priceCaption: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    paddingTop: 18,
    paddingBottom: 2,
  },
  phoneFrame: {
    width: 277.3,
    height: 452.7,
  },
  sideButton: {
    position: 'absolute',
    width: 5,
    borderRadius: 2.5,
    backgroundColor: mock.frameFill,
  },
  phoneBody: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 277.3,
    height: 452.7,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: mock.frameFill,
  },
  dashboardWrap: {
    position: 'absolute',
    left: 5.7,
    top: 7,
  },
  notch: {
    position: 'absolute',
    left: 85.8,
    top: 7,
    width: 105.7,
    height: 7,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: mock.frameFill,
  },
  dashboard: {
    width: 266,
    height: 445.7,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  dashHeader: {
    position: 'absolute',
    left: 18.7,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  tabs: {
    position: 'absolute',
    left: 17.7,
    top: 53,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tabActive: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  tabInactive: {
    fontSize: 14,
    color: '#3A3A3C',
  },
  tabDot: {
    position: 'absolute',
    left: 30.3,
    top: 66,
    width: 3.3,
    height: 3.3,
    borderRadius: 1.65,
    backgroundColor: colors.ink,
  },
  bigCard: {
    position: 'absolute',
    left: 18,
    top: 79.7,
    width: 230.7,
    height: 81.3,
  },
  bigRing: {
    position: 'absolute',
    left: 150.05,
    top: 10.25,
    width: 62.7,
    height: 62.7,
  },
  bigText: {
    position: 'absolute',
    left: 18.7,
    top: 16,
    alignItems: 'flex-start',
    gap: 2,
  },
  bigValue: {
    fontSize: 29,
    fontWeight: '700',
    color: colors.ink,
  },
  bigLabel: {
    fontSize: 11,
    color: mock.secondary,
  },
  miniRow: {
    position: 'absolute',
    left: 17.7,
    top: 172,
    flexDirection: 'row',
    gap: 7.5,
  },
  miniCard: {
    width: 72,
    height: 90.7,
  },
  miniRing: {
    position: 'absolute',
    left: 18.15,
    top: 45.85,
    width: 35.7,
    height: 35.7,
  },
  miniText: {
    position: 'absolute',
    left: 6.7,
    top: 8,
    width: 58.6,
    alignItems: 'flex-start',
    gap: 1,
  },
  miniValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  miniLabel: {
    fontSize: 10.5,
    color: mock.secondary,
  },
  pouchIcon: {
    width: 7,
    height: 11,
    borderRadius: 3.5,
    backgroundColor: mock.red,
  },
  recentText: {
    position: 'absolute',
    left: 18.4,
    top: 283,
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  checkInRow: {
    position: 'absolute',
    left: 17,
    top: 309,
    width: 232.3,
    height: 78,
    flexDirection: 'row',
  },
  checkImage: {
    width: 78.7,
    height: 78,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBody: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  checkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkTitle: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.ink,
    flexShrink: 1,
  },
  flexFill: {
    flex: 1,
  },
  timePill: {
    width: 45.3,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.ink,
  },
  gap8: {
    height: 8,
  },
  gap9: {
    height: 9,
  },
  checkStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  checkStatText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.ink,
  },
  checkMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  miniInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
  },
  miniInlineText: {
    fontSize: 9.5,
    fontWeight: '500',
    color: mock.statText,
  },
  ringStage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
