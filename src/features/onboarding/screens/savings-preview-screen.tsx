import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { ChoicePairButtons } from '@/components/ui/choice-pair-buttons';
import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

const HERO_WIDTH = 280;
const HERO_HEIGHT = 329;

const savedLabelInk = '#1D1C21';
const amountInk = '#1C1B22';
const todayLabelInk = '#030303';
const fadeInk = '#F0F0F0';
const heroStopZero = '#E7F5EC';
const heroStopOne = '#C6E6D2';
const heroStopTwo = '#9BCDB1';
const heroStopThree = '#C0E2CE';
const heroStopFour = '#DDF0E4';
const glowGreen = '#7FBD98';
const glowMint = '#EAF8F0';
const footerEdge = '#FDFDFD';
const footerCore = '#FAFAFA';

const fadeColors = [withAlpha(fadeInk, 0), fadeInk] as const;
const footerColors = [footerEdge, footerCore, footerEdge] as const;

function HeroBackground() {
  return (
    <Svg width={HERO_WIDTH} height={HERO_HEIGHT}>
      <Defs>
        <SvgLinearGradient id="heroBase" x1={0} y1={0} x2={HERO_WIDTH} y2={HERO_HEIGHT} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={heroStopZero} />
          <Stop offset={0.38} stopColor={heroStopOne} />
          <Stop offset={0.62} stopColor={heroStopTwo} />
          <Stop offset={0.82} stopColor={heroStopThree} />
          <Stop offset={1} stopColor={heroStopFour} />
        </SvgLinearGradient>
        <RadialGradient id="glowOne" cx={220} cy={49.5} r={145} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={colors.white} stopOpacity={0.65} />
          <Stop offset={0.45} stopColor={colors.white} stopOpacity={0.65} />
          <Stop offset={0.72} stopColor={colors.white} stopOpacity={0.32} />
          <Stop offset={1} stopColor={colors.white} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="glowTwo" cx={80} cy={194.5} r={160} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={glowGreen} stopOpacity={0.5} />
          <Stop offset={0.44} stopColor={glowGreen} stopOpacity={0.5} />
          <Stop offset={0.72} stopColor={glowGreen} stopOpacity={0.25} />
          <Stop offset={1} stopColor={glowGreen} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="glowThree" cx={200} cy={294.5} r={130} gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor={glowMint} stopOpacity={0.8} />
          <Stop offset={0.38} stopColor={glowMint} stopOpacity={0.8} />
          <Stop offset={0.69} stopColor={glowMint} stopOpacity={0.4} />
          <Stop offset={1} stopColor={glowMint} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={HERO_WIDTH} height={HERO_HEIGHT} fill="url(#heroBase)" />
      <Rect x={0} y={0} width={HERO_WIDTH} height={HERO_HEIGHT} fill="url(#glowOne)" />
      <Rect x={0} y={0} width={HERO_WIDTH} height={HERO_HEIGHT} fill="url(#glowTwo)" />
      <Rect x={0} y={0} width={HERO_WIDTH} height={HERO_HEIGHT} fill="url(#glowThree)" />
    </Svg>
  );
}

export default function SavingsPreviewScreen() {
  const set = useOnboarding((state) => state.set);
  const { advance } = useFlow('savings-preview');
  const cardVisible = useSharedValue(0);

  useEffect(() => {
    cardVisible.value = withDelay(200, withSpring(1, { duration: 500, dampingRatio: 0.8 }));
  }, [cardVisible]);

  const statCardStyle = useAnimatedStyle(() => ({
    opacity: cardVisible.value,
    transform: [{ scale: 0.85 + 0.15 * cardVisible.value }],
  }));

  const footer = (
    <View style={styles.footer}>
      <LinearGradient
        colors={footerColors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.footerHairline} />
      <View style={styles.footerInner}>
        <ChoicePairButtons
          onChoice={(value) => {
            set('showSavings', value);
            advance();
          }}
        />
      </View>
    </View>
  );

  return (
    <OnboardingScaffold step="savings-preview" footer={footer}>
      <View style={styles.container}>
        <LinearGradient
          colors={fadeColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.bottomFade}
        />
        <TitleBlock title="See the money you save every day?" />
        <View style={styles.heroPosition}>
          <View style={styles.heroCard}>
            <View style={styles.heroBackground}>
              <HeroBackground />
            </View>
            <Animated.View style={[styles.statCardWrap, statCardStyle]}>
              <GlassSurface
                style={styles.statCard}
                radius={layout.cardRadius}
                tintColor={withAlpha(colors.white, 0.85)}>
                <Text style={styles.savedLabel}>Saved so far</Text>
                <View style={styles.amountRow}>
                  <Icon name="banknote.fill" size={18} weight="semibold" color={colors.ink} style={styles.banknote} />
                  <Text style={styles.amountText}>45,00 €</Text>
                </View>
                <View style={styles.todayRow}>
                  <View style={styles.euroBadge}>
                    <Icon name="eurosign" size={12.5} weight="bold" color={colors.white} />
                  </View>
                  <View style={styles.todayColumn}>
                    <Text style={styles.todayLabel}>Today</Text>
                    <View style={styles.todayCapsule}>
                      <Text style={styles.todayValue}>+4,50 €</Text>
                    </View>
                  </View>
                </View>
              </GlassSurface>
            </Animated.View>
          </View>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
  },
  heroPosition: {
    position: 'absolute',
    top: 204,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  heroCard: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  heroBackground: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
  },
  statCardWrap: {
    position: 'absolute',
    left: 11,
    bottom: 11.3,
    borderRadius: layout.cardRadius,
    shadowColor: colors.ink,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  statCard: {
    width: 155,
    height: 150,
    paddingLeft: 14,
    paddingTop: 19,
    alignItems: 'flex-start',
  },
  savedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: savedLabelInk,
    marginLeft: 30.7,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  banknote: {
    width: 20.7,
  },
  amountText: {
    fontSize: 25,
    fontWeight: '700',
    color: amountInk,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 18,
  },
  euroBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayColumn: {
    marginTop: 2,
    gap: 5,
    alignItems: 'flex-start',
  },
  todayLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: todayLabelInk,
  },
  todayCapsule: {
    height: 24.7,
    borderRadius: 12.35,
    backgroundColor: colors.cardFill,
    paddingHorizontal: 7.3,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  todayValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  footer: {
    position: 'relative',
  },
  footerHairline: {
    height: 0.33,
    backgroundColor: colors.hairline,
  },
  footerInner: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 15.7,
    paddingBottom: 16,
  },
});
