import { useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { colors, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const graphInk = '#1E1B24';
const graphRed = '#DC6868';
const dashColor = '#CFCFCF';
const baselineColor = '#0A0A0A';
const grayFill = '#E3E3E3';
const graphCardFill = '#F9F9F9';
const labelInk = '#1E1C22';
const axisInk = '#2D2C31';
const curveLabelInk = '#2E2D32';
const footnoteInk = '#555555';
const pillFill = '#1F1B25';

const designWidth = 342;
const cardHeight = 299;

type Point = { x: number; y: number };

const blackPoints: Point[] = [
  { x: 23.8, y: 74.8 }, { x: 61, y: 75.6 }, { x: 121, y: 83.6 },
  { x: 141, y: 92.1 }, { x: 161, y: 106.5 }, { x: 181, y: 125.1 },
  { x: 201, y: 140.3 }, { x: 221, y: 153 }, { x: 241, y: 163.1 },
  { x: 261, y: 169 }, { x: 281, y: 170.6 }, { x: 316.6, y: 171.8 },
];

const redPoints: Point[] = [
  { x: 23.8, y: 75.3 }, { x: 41, y: 77.3 }, { x: 61, y: 78.6 },
  { x: 81, y: 83.5 }, { x: 101, y: 92.8 }, { x: 121, y: 108.6 },
  { x: 141, y: 127.1 }, { x: 160.3, y: 130.8 }, { x: 181, y: 118.8 },
  { x: 201, y: 100.6 }, { x: 221, y: 81.3 }, { x: 241, y: 65.1 },
  { x: 261, y: 52.8 }, { x: 281, y: 44 }, { x: 322.6, y: 36.8 },
];

function smoothPath(points: Point[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  if (points.length < 2) return d;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(index - 1, 0)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(index + 2, points.length - 1)];
    const c1x = current.x + (next.x - previous.x) / 6;
    const c1y = current.y + (next.y - previous.y) / 6;
    const c2x = next.x - (following.x - current.x) / 6;
    const c2y = next.y - (following.y - current.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${next.x} ${next.y}`;
  }
  return d;
}

export default function LongTermResultsScreen() {
  const flow = useFlow('results-graph');
  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.resultsGraph.title} />
        <View style={styles.cardWrap}>
          <GraphCard />
        </View>
      </View>
    </OnboardingScaffold>
  );
}

function GraphCard() {
  const [width, setWidth] = useState(designWidth);
  const scale = width / designWidth;
  const sx = (value: number) => value * scale;

  const black = blackPoints.map((p) => ({ x: p.x * scale, y: p.y }));
  const red = redPoints.map((p) => ({ x: p.x * scale, y: p.y }));

  const grayArea = `${smoothPath(black)} L ${sx(316.6)} 172.3 L ${sx(18)} 172.3 L ${sx(18)} 74.8 Z`;
  const pinkArea = `${smoothPath(red)} L ${sx(322.6)} 76.3 L ${sx(23.8)} 76.3 Z`;
  const blackLine = smoothPath(black);
  const redLine = smoothPath(red);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <GlassSurface style={styles.card} radius={20} tintColor={withAlpha(graphCardFill, 0.85)}>
      <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
        <Svg width={width} height={cardHeight}>
          <Defs>
            <LinearGradient id="grayGrad" gradientUnits="userSpaceOnUse" x1={0} y1={75} x2={0} y2={172}>
              <Stop offset={0} stopColor={grayFill} stopOpacity={1} />
              <Stop offset={1} stopColor={grayFill} stopOpacity={0.45} />
            </LinearGradient>
            <LinearGradient id="pinkGrad" gradientUnits="userSpaceOnUse" x1={0} y1={36.8} x2={0} y2={76.3}>
              <Stop offset={0} stopColor={graphRed} stopOpacity={0.18} />
              <Stop offset={1} stopColor={graphRed} stopOpacity={0.05} />
            </LinearGradient>
            <ClipPath id="pinkClip">
              <Rect x={0} y={0} width={width} height={76.3} />
            </ClipPath>
          </Defs>

          {[76.3, 124.3].map((level) => (
            <Line
              key={level}
              x1={sx(18)}
              y1={level}
              x2={sx(321.6)}
              y2={level}
              stroke={dashColor}
              strokeWidth={1}
              strokeDasharray={[2, 2.33]}
            />
          ))}

          <Path d={grayArea} fill="url(#grayGrad)" />
          <Path d={pinkArea} fill="url(#pinkGrad)" clipPath="url(#pinkClip)" />

          <Path d={blackLine} stroke={graphInk} strokeWidth={2} strokeLinecap="round" fill="none" />
          <Path d={redLine} stroke={graphRed} strokeWidth={2.3} strokeLinecap="round" fill="none" />

          <Line x1={sx(20)} y1={172.3} x2={sx(323.6)} y2={172.3} stroke={baselineColor} strokeWidth={1.2} />

          <Circle cx={sx(23.8)} cy={74.8} r={6} fill={colors.white} stroke={graphInk} strokeWidth={2} />
          <Circle cx={sx(316.6)} cy={171.8} r={6} fill={colors.white} stroke={graphInk} strokeWidth={2} />
        </Svg>
      </View>

      <Text style={styles.cardTitle}>{content.resultsGraph.cardTitle}</Text>

      <View style={styles.brandRow}>
        <View style={styles.brandName}>
          <Icon name="leaf.fill" size={11} weight="bold" color={graphInk} />
          <Text style={styles.brandText}>{content.resultsGraph.brandText}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{content.resultsGraph.pillLabel}</Text>
        </View>
      </View>

      <Text style={[styles.curveLabel, { top: 83, right: width - sx(324.3) }]}>{content.resultsGraph.curveLabel}</Text>
      <Text style={[styles.axisLabel, { top: 183.3, left: sx(20.6) }]}>{content.resultsGraph.axisStart}</Text>
      <Text style={[styles.axisLabel, { top: 183.3, right: width - sx(323) }]}>{content.resultsGraph.axisEnd}</Text>

      <View style={styles.footnote}>
        <Text style={styles.footnoteText}>{content.resultsGraph.footnote}</Text>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrap: {
    paddingHorizontal: 25.5,
    paddingTop: 116,
  },
  card: {
    height: cardHeight,
  },
  cardTitle: {
    position: 'absolute',
    left: 15,
    top: 26,
    fontSize: 20,
    fontWeight: '600',
    color: labelInk,
  },
  brandRow: {
    position: 'absolute',
    left: 18.5,
    top: 156.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7.5,
  },
  brandName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    color: graphInk,
  },
  pill: {
    height: 14,
    paddingHorizontal: 8,
    borderRadius: 7,
    backgroundColor: pillFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.white,
  },
  curveLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '500',
    color: curveLabelInk,
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '500',
    color: axisInk,
  },
  footnote: {
    position: 'absolute',
    top: 230,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footnoteText: {
    maxWidth: 280,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    color: footnoteInk,
  },
});
