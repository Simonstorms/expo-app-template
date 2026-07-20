import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { ScreenBackground } from '@/components/ui/screen-background';
import { content } from '@/constants/content';
import { colors, withAlpha } from '@/constants/theme';

const accentOrange = '#DE9B6C';
const accentRed = '#DC6868';
const accentBlue = '#6996DA';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={styles.header}>
          <Icon name="leaf.fill" size={22} weight="semibold" color={colors.ctaFill} />
          <Text style={styles.wordmark}>{content.home.wordmark}</Text>
        </View>

        <GlassSurface radius={22} tintColor={withAlpha(colors.white, 0.85)} style={styles.heroCard}>
          <View style={styles.heroText}>
            <Text style={styles.heroValue}>{content.home.heroValue}</Text>
            <Text style={styles.heroLabel}>{content.home.heroLabel}</Text>
            <Text style={styles.heroSub}>{content.home.heroSub}</Text>
          </View>
          <Ring diameter={92} lineWidth={8} progress={0.62} tint={colors.ink}>
            <Icon name="leaf.fill" size={24} weight="semibold" color={colors.ink} />
          </Ring>
        </GlassSurface>

        <View style={styles.statRow}>
          <StatCard label={content.home.statAvoidedLabel} value={content.home.statAvoidedValue} tint={accentRed} progress={0.72} symbol="capsule.portrait.fill" />
          <StatCard label={content.home.statSavedLabel} value={content.home.statSavedValue} tint={accentOrange} progress={0.55} symbol="banknote.fill" />
          <StatCard label={content.home.statHealthLabel} value={content.home.statHealthValue} tint={accentBlue} progress={0.92} symbol="heart.fill" />
        </View>

        <Text style={styles.sectionTitle}>{content.home.sectionTitle}</Text>
        <GlassGroup spacing={11}>
          <CheckInRow
            title={content.home.checkinCravingTitle}
            time={content.home.checkinCravingTime}
            detail={content.home.checkinCravingDetail}
            symbol="flame.fill"
            tint={accentRed}
          />
          <CheckInRow
            title={content.home.checkinWalkTitle}
            time={content.home.checkinWalkTime}
            detail={content.home.checkinWalkDetail}
            symbol="figure.walk"
            tint={accentBlue}
          />
        </GlassGroup>

        <View style={styles.cta}>
          <PrimaryCTA title={content.home.cta} onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

function Ring({
  diameter,
  lineWidth,
  progress,
  tint,
  children,
}: {
  diameter: number;
  lineWidth: number;
  progress: number;
  tint: string;
  children?: ReactNode;
}) {
  const center = diameter / 2;
  const radius = (diameter - lineWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ width: diameter, height: diameter, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={diameter} height={diameter} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.progressTrack}
          strokeWidth={lineWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={tint}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[circumference * progress, circumference]}
          originX={center}
          originY={center}
          rotation={-90}
        />
      </Svg>
      {children}
    </View>
  );
}

function StatCard({
  label,
  value,
  tint,
  progress,
  symbol,
}: {
  label: string;
  value: string;
  tint: string;
  progress: number;
  symbol: string;
}) {
  return (
    <GlassSurface radius={16} tintColor={withAlpha(colors.white, 0.85)} style={styles.statCard}>
      <Ring diameter={44} lineWidth={5} progress={progress} tint={tint}>
        <Icon name={symbol} size={13} weight="semibold" color={tint} />
      </Ring>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </GlassSurface>
  );
}

function CheckInRow({
  title,
  time,
  detail,
  symbol,
  tint,
}: {
  title: string;
  time: string;
  detail: string;
  symbol: string;
  tint: string;
}) {
  return (
    <GlassSurface radius={14} tintColor={withAlpha(colors.cardFill, 0.9)} style={styles.checkRow}>
      <View style={[styles.checkIcon, { backgroundColor: withAlpha(tint, 0.14) }]}>
        <Icon name={symbol} size={16} weight="semibold" color={tint} />
      </View>
      <View style={styles.checkBody}>
        <View style={styles.checkTop}>
          <Text style={styles.checkTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.checkTime}>{time}</Text>
        </View>
        <Text style={styles.checkDetail}>{detail}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 20,
  },
  wordmark: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.ink,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 22,
    overflow: 'hidden',
  },
  heroText: {
    flex: 1,
    gap: 3,
  },
  heroValue: {
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.ink,
  },
  heroLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  heroSub: {
    marginTop: 2,
    fontSize: 13,
    color: colors.secondaryText,
  },
  statRow: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 13,
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  checkIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBody: {
    flex: 1,
    gap: 3,
  },
  checkTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  checkTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  checkDetail: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  cta: {
    marginTop: 28,
  },
});
