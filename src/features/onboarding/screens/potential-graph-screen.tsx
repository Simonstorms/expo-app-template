import { useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const PLOT_HEIGHT = 176;

type Point = readonly [number, number];

const CURVE_POINTS: readonly Point[] = [
  [0.0109, 128.7],
  [0.0583, 128.3],
  [0.1137, 127],
  [0.169, 125],
  [0.2241, 124],
  [0.2718, 122],
  [0.3348, 115],
  [0.3898, 103.3],
  [0.4452, 93],
  [0.5005, 81],
  [0.5224, 79.7],
  [0.5555, 74],
  [0.6109, 65.3],
  [0.6663, 55.3],
  [0.7213, 47.3],
  [0.7766, 40],
  [0.832, 34],
  [0.887, 29],
  [0.9423, 22],
  [0.992, 18.7],
];

const DOT_POINTS: readonly Point[] = [
  [0.0109, 128.7],
  [0.2718, 122],
  [0.5224, 79.7],
];

const V_GRIDLINES: readonly { x: number; top: number }[] = [
  { x: 0.2751, top: 129 },
  { x: 0.5214, top: 87.7 },
  { x: 0.992, top: 39.7 },
];

const AXIS_LABEL_POSITIONS = [0.1296, 0.3981, 0.7666] as const;

function buildCurvePath(width: number): string {
  const mapped = CURVE_POINTS.map(([fx, y]): Point => [fx * width, y]);
  const first = mapped[0];
  const last = mapped[mapped.length - 1];
  let d = `M ${first[0]} ${first[1]}`;
  for (let index = 1; index < mapped.length - 1; index += 1) {
    const current = mapped[index];
    const next = mapped[index + 1];
    const midX = (current[0] + next[0]) / 2;
    const midY = (current[1] + next[1]) / 2;
    d += ` Q ${current[0]} ${current[1]} ${midX} ${midY}`;
  }
  d += ` L ${last[0]} ${last[1]}`;
  return d;
}

function buildAreaPath(width: number): string {
  const first = CURVE_POINTS[0];
  const last = CURVE_POINTS[CURVE_POINTS.length - 1];
  return `${buildCurvePath(width)} L ${last[0] * width} ${PLOT_HEIGHT} L ${first[0] * width} ${PLOT_HEIGHT} Z`;
}

export default function PotentialGraphScreen() {
  const flow = useFlow('potential-graph');
  const [plotWidth, setPlotWidth] = useState(0);

  const onChartLayout = (event: LayoutChangeEvent) => {
    setPlotWidth(event.nativeEvent.layout.width);
  };

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.potentialGraph.title} />
        <View style={styles.cardWrap}>
          <GlassSurface
            style={styles.card}
            radius={layout.cardRadius}
            tintColor={withAlpha('#F9F9F9', 0.9)}>
            <Text style={styles.cardTitle}>{content.potentialGraph.cardTitle}</Text>
            <View style={styles.chartOuter}>
              <View style={styles.chart} onLayout={onChartLayout}>
                <View style={styles.plot}>
                  {plotWidth > 0 ? (
                    <Svg width={plotWidth} height={PLOT_HEIGHT} style={StyleSheet.absoluteFill}>
                      <Defs>
                        <LinearGradient
                          id="areaFill"
                          x1="0"
                          y1="0"
                          x2={plotWidth}
                          y2="0"
                          gradientUnits="userSpaceOnUse">
                          <Stop offset="0" stopColor="#F1F1F1" />
                          <Stop offset="0.246" stopColor="#E9E9E9" />
                          <Stop offset="0.478" stopColor="#E4DEDA" />
                          <Stop offset="0.777" stopColor="#EDE3DB" />
                          <Stop offset="1" stopColor="#F1E2D7" />
                        </LinearGradient>
                        <LinearGradient
                          id="curveStroke"
                          x1="0"
                          y1="0"
                          x2={plotWidth}
                          y2="0"
                          gradientUnits="userSpaceOnUse">
                          <Stop offset="0.011" stopColor="#1B1A1E" />
                          <Stop offset="0.395" stopColor="#523E3A" />
                          <Stop offset="0.72" stopColor="#A3775A" />
                          <Stop offset="0.992" stopColor="#DF9C69" />
                        </LinearGradient>
                      </Defs>
                      <Path d={buildAreaPath(plotWidth)} fill="url(#areaFill)" />
                      <Line
                        x1={0}
                        y1={80.3}
                        x2={plotWidth}
                        y2={80.3}
                        stroke="#CDCDCD"
                        strokeWidth={1}
                        strokeDasharray="2,2"
                      />
                      <Line
                        x1={0}
                        y1={128.3}
                        x2={plotWidth}
                        y2={128.3}
                        stroke="#CDCDCD"
                        strokeWidth={1}
                        strokeDasharray="2,2"
                      />
                      {V_GRIDLINES.map((line, index) => (
                        <Line
                          key={line.x}
                          x1={line.x * plotWidth}
                          y1={line.top}
                          x2={line.x * plotWidth}
                          y2={PLOT_HEIGHT}
                          stroke="#CFCFCF"
                          strokeOpacity={index === 0 ? 0.55 : 1}
                          strokeWidth={1}
                          strokeDasharray="2,2.3"
                        />
                      ))}
                      <Path
                        d={buildCurvePath(plotWidth)}
                        stroke="url(#curveStroke)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      {DOT_POINTS.map(([fx, y]) => (
                        <Circle key={`fill-${fx}`} cx={fx * plotWidth} cy={y} r={7} fill="#FBFAFE" />
                      ))}
                      {DOT_POINTS.map(([fx, y]) => (
                        <Circle
                          key={`ring-${fx}`}
                          cx={fx * plotWidth}
                          cy={y}
                          r={6}
                          fill="none"
                          stroke="#1B1A1E"
                          strokeWidth={2}
                        />
                      ))}
                    </Svg>
                  ) : null}
                  {plotWidth > 0 ? (
                    <View style={[styles.point, { left: 0.9831 * plotWidth, top: 24.7 }]}>
                      <View style={styles.trophyOuter}>
                        <View style={styles.trophyInner}>
                          <Icon name="trophy.fill" size={13} weight="medium" color={colors.white} />
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
                <View style={styles.baseline} />
                <View style={styles.axisRow}>
                  {plotWidth > 0
                    ? content.potentialGraph.axisLabels.map((label, index) => (
                        <View key={label} style={[styles.point, { left: AXIS_LABEL_POSITIONS[index] * plotWidth, top: 20 }]}>
                          <Text style={styles.axisLabel}>{label}</Text>
                        </View>
                      ))
                    : null}
                </View>
              </View>
            </View>
            <View style={styles.footnoteWrap}>
              <Text style={styles.footnote}>{content.potentialGraph.footnote}</Text>
            </View>
          </GlassSurface>
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 0,
  },
  cardWrap: {
    paddingTop: 52,
    paddingHorizontal: 26,
  },
  card: {
    borderRadius: layout.cardRadius,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111113',
    paddingLeft: 13.7,
    paddingTop: 27,
  },
  chartOuter: {
    alignSelf: 'stretch',
    paddingHorizontal: 19.7,
    paddingTop: 5,
  },
  chart: {
    alignSelf: 'stretch',
  },
  plot: {
    height: PLOT_HEIGHT,
  },
  baseline: {
    height: 1,
    backgroundColor: '#1D191F',
  },
  axisRow: {
    height: 32,
  },
  point: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111116',
  },
  trophyOuter: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DF9B68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footnoteWrap: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 18,
  },
  footnote: {
    maxWidth: 306,
    fontSize: 16,
    fontWeight: '400',
    color: '#4D4D4D',
    textAlign: 'center',
    lineHeight: 18,
  },
});
