import { useEffect, useState } from 'react';
import { type LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const CARD_HEIGHT = 358;
const COLUMN_WIDTH = 102;
const COLUMN_HEIGHT = 200;
const BAR_COLLAPSED_HEIGHT = 52;
const BAR_REVEALED_HEIGHT = 136;

type CardGlow = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
};

function cardGlows(width: number): CardGlow[] {
  return [
    { id: 'topLeading', cx: 0, cy: 0, r: 240, color: '#EFEEF1' },
    { id: 'topTrailing', cx: width, cy: 0, r: 230, color: '#F9F4F4' },
    { id: 'trailing', cx: width, cy: CARD_HEIGHT / 2, r: 200, color: '#F6F3F9' },
    { id: 'leading', cx: 0, cy: CARD_HEIGHT / 2, r: 190, color: '#EFF3F4' },
    { id: 'bottomLeading', cx: 0, cy: CARD_HEIGHT, r: 240, color: '#F1F7F3' },
    { id: 'bottomTrailing', cx: width, cy: CARD_HEIGHT, r: 220, color: '#F7F2F3' },
  ];
}

export default function ComparisonScreen() {
  const flow = useFlow('comparison');
  const [cardWidth, setCardWidth] = useState(0);
  const barRevealed = useSharedValue(0);

  useEffect(() => {
    barRevealed.value = withDelay(200, withSpring(1, { duration: 650, dampingRatio: 0.75 }));
  }, [barRevealed]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    height: BAR_COLLAPSED_HEIGHT + (BAR_REVEALED_HEIGHT - BAR_COLLAPSED_HEIGHT) * barRevealed.value,
  }));

  const handleCardLayout = (event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  };

  const glows = cardGlows(cardWidth);

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.comparison.title} />
        <View style={styles.card} onLayout={handleCardLayout}>
          {cardWidth > 0 ? (
            <Svg width={cardWidth} height={CARD_HEIGHT} style={StyleSheet.absoluteFill}>
              <Defs>
                {glows.map((glow) => (
                  <RadialGradient
                    key={glow.id}
                    id={glow.id}
                    cx={glow.cx}
                    cy={glow.cy}
                    r={glow.r}
                    gradientUnits="userSpaceOnUse">
                    <Stop offset={0} stopColor={glow.color} stopOpacity={1} />
                    <Stop offset={1} stopColor={glow.color} stopOpacity={0} />
                  </RadialGradient>
                ))}
              </Defs>
              {glows.map((glow) => (
                <Rect
                  key={`fill-${glow.id}`}
                  x={0}
                  y={0}
                  width={cardWidth}
                  height={CARD_HEIGHT}
                  fill={`url(#${glow.id})`}
                />
              ))}
            </Svg>
          ) : null}
          <View style={styles.cardContent}>
            <GlassGroup spacing={18} style={styles.columnsRow}>
              <GlassSurface
                radius={layout.cardRadius}
                tintColor={withAlpha(colors.white, 0.85)}
                style={styles.column}>
                <Text style={styles.columnLabel}>{content.comparison.columnLeft}</Text>
                <View style={styles.columnSpacer} />
                <View style={styles.badgeInset}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>{content.comparison.badgeLabel}</Text>
                  </View>
                </View>
              </GlassSurface>
              <GlassSurface
                radius={layout.cardRadius}
                tintColor={withAlpha(colors.white, 0.85)}
                style={styles.column}>
                <Text style={styles.columnLabel}>{content.comparison.columnRight}</Text>
                <View style={styles.columnSpacer} />
                <Animated.View style={[styles.bar, barAnimatedStyle]}>
                  <Text style={styles.barLabel}>{content.comparison.barLabel}</Text>
                </Animated.View>
              </GlassSurface>
            </GlassGroup>
            <Text style={styles.caption}>
              <Text style={styles.captionDark}>{content.comparison.captionDark}</Text>
              {'\n'}
              <Text style={styles.captionLight}>{content.comparison.captionLight}</Text>
            </Text>
            <View style={styles.cardBottomSpacer} />
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 67,
    marginHorizontal: 32,
    height: CARD_HEIGHT,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
  },
  columnsRow: {
    flexDirection: 'row',
    marginTop: 46,
  },
  column: {
    width: COLUMN_WIDTH,
    height: COLUMN_HEIGHT,
  },
  columnLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    paddingTop: 16,
  },
  columnSpacer: {
    flex: 1,
  },
  badgeInset: {
    paddingHorizontal: 1.5,
    paddingBottom: 1.5,
  },
  badge: {
    height: 52,
    borderRadius: 13,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  bar: {
    width: '100%',
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    paddingBottom: 14,
  },
  caption: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 30,
  },
  captionDark: {
    color: '#5A5A5A',
  },
  captionLight: {
    color: '#C6C6C6',
  },
  cardBottomSpacer: {
    flex: 1,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 16,
  },
});
