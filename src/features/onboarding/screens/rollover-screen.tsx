import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { ChoicePairButtons } from '@/components/ui/choice-pair-buttons';
import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

const ink = '#1E1A22';
const blue = '#6D9BDC';
const badgeBlue = '#6F9BD7';
const salmon = '#D06364';
const headerPink = '#FBF0EF';
const headerGray = '#E8E8E8';
const denominator = '#99989B';
const ringTrackA = '#EFF0F5';
const ringTrackB = '#F1F0F7';
const chipFill = '#EFF1F7';
const footerFill = 'rgba(254, 254, 254, 0.94)';

export default function RolloverScreen() {
  const set = useOnboarding((state) => state.set);
  const { advance } = useFlow('rollover');

  return (
    <OnboardingScaffold
      step="rollover"
      footer={
        <View style={styles.footer}>
          <View style={styles.footerHairline} />
          <View style={styles.footerButtons}>
            <ChoicePairButtons
              onChoice={(value) => {
                set('rolloverPouches', value);
                advance();
              }}
            />
          </View>
        </View>
      }>
      <View style={styles.container}>
        <TitleBlock title="Roll over unused pouches to the next day?" />
        <View style={styles.pillWrap}>
          <GlassSurface radius={13} tintColor={withAlpha(colors.progressTrack, 0.7)} style={styles.pill}>
            <Text style={styles.pillText}>
              <Text style={{ color: ink }}>Roll over up to </Text>
              <Text style={{ color: blue }}>2 pouches</Text>
            </Text>
          </GlassSurface>
        </View>
        <GlassGroup style={styles.illustration}>
          <DayCard left={28.7} top={0} height={210}>
            <DayCardHeader title="Yesterday" titleColor={salmon} fill={headerPink} />
            <CountText denominatorText="/5" />
            <MiniRing start={0} end={0.76} track={ringTrackA} left={42} top={111} />
            <LeftBadge
              width={58}
              left={4}
              top={97}
              secondLine={<Text style={styles.badgeText}>2</Text>}
            />
          </DayCard>
          <DayCard left={204.7} top={63} height={228}>
            <DayCardHeader title="Today" titleColor={ink} fill={headerGray} />
            <CountText denominatorText="/7" />
            <RolloverChip left={12.7} top={87.7} />
            <MiniRing start={0.017} end={0.8} track={ringTrackB} left={41.6} top={129.7} />
            <LeftBadge
              width={65.3}
              left={4}
              top={128}
              secondLine={
                <Text style={styles.badgeText}>
                  <Text>2 + </Text>
                  <Text style={{ color: badgeBlue }}>2</Text>
                </Text>
              }
            />
          </DayCard>
        </GlassGroup>
        <View style={styles.flexSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function DayCard({
  left,
  top,
  height,
  children,
}: {
  left: number;
  top: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <View style={[styles.cardShadow, { left, top, height }]}>
      <GlassSurface radius={16} tintColor={withAlpha('#FFFFFF', 0.92)} style={styles.cardGlass}>
        {children}
      </GlassSurface>
    </View>
  );
}

function DayCardHeader({
  title,
  titleColor,
  fill,
}: {
  title: string;
  titleColor: string;
  fill: string;
}) {
  return (
    <View style={[styles.header, { backgroundColor: fill }]}>
      <Text style={[styles.headerTitle, { color: titleColor }]}>{title}</Text>
      <View style={styles.headerLeaf}>
        <Icon name="leaf.fill" size={12.5} color="#000000" />
      </View>
    </View>
  );
}

function CountText({ denominatorText }: { denominatorText: string }) {
  return (
    <View style={styles.count}>
      <Text>
        <Text style={styles.countNumerator}>3</Text>
        <Text style={styles.countDenominator}>{denominatorText}</Text>
      </Text>
    </View>
  );
}

function ringArc(start: number, end: number): string {
  const cx = 38;
  const cy = 38;
  const r = 36;
  const point = (fraction: number) => {
    const angle = 2 * Math.PI * fraction;
    return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
  };
  const from = point(start);
  const to = point(end);
  const largeArc = end - start > 0.5 ? 1 : 0;
  return `M ${from.x} ${from.y} A ${r} ${r} 0 ${largeArc} 1 ${to.x} ${to.y}`;
}

function MiniRing({
  start,
  end,
  track,
  left,
  top,
}: {
  start: number;
  end: number;
  track: string;
  left: number;
  top: number;
}) {
  return (
    <View style={[styles.miniRing, { left, top }]}>
      <Svg width={76} height={76}>
        <Circle cx={38} cy={38} r={36} stroke={track} strokeWidth={4} fill="none" />
        <Path d={ringArc(start, end)} stroke={colors.ctaFill} strokeWidth={4} fill="none" />
        <Circle cx={38} cy={38} r={21.65} fill={colors.cardFill} />
      </Svg>
      <View style={styles.miniRingLeaf}>
        <Icon name="leaf.fill" size={13.5} color="#000000" />
      </View>
    </View>
  );
}

function LeftBadge({
  width,
  left,
  top,
  secondLine,
}: {
  width: number;
  left: number;
  top: number;
  secondLine: ReactNode;
}) {
  return (
    <View style={[styles.badge, { width, left, top }]}>
      <Text style={styles.badgeText}>Left</Text>
      {secondLine}
    </View>
  );
}

function RolloverChip({ left, top }: { left: number; top: number }) {
  return (
    <View style={[styles.chip, { left, top }]}>
      <View style={styles.chipCircle}>
        <Icon name="clock.arrow.circlepath" size={10} weight="semibold" color="#000000" />
      </View>
      <Text style={styles.chipText}>
        <Text style={{ color: '#FFFFFF' }}>+</Text>
        <Text style={{ color: blue }}>2</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pillWrap: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: layout.margin,
    paddingTop: 10,
  },
  pill: {
    alignSelf: 'flex-start',
    height: 26,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  illustration: {
    width: '100%',
    height: 291,
    marginTop: 76,
  },
  flexSpacer: {
    flex: 1,
  },
  cardShadow: {
    position: 'absolute',
    width: 159.7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  cardGlass: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    height: 34.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerLeaf: {
    position: 'absolute',
    left: 12.7,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 48,
    alignItems: 'center',
  },
  countNumerator: {
    fontSize: 34,
    fontWeight: '700',
    color: ink,
  },
  countDenominator: {
    fontSize: 20,
    fontWeight: '600',
    color: denominator,
  },
  miniRing: {
    position: 'absolute',
    width: 76,
    height: 76,
  },
  miniRingLeaf: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    height: 41.3,
    borderRadius: 10,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 24.3,
    paddingLeft: 1.8,
    paddingRight: 9,
    borderRadius: 12.15,
    backgroundColor: chipFill,
  },
  chipCircle: {
    width: 20.7,
    height: 20.7,
    borderRadius: 10.35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: footerFill,
  },
  footerHairline: {
    height: 0.7,
    backgroundColor: colors.hairline,
  },
  footerButtons: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 15,
  },
});
