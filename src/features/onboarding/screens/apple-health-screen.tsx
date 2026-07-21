import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

const LINE_INK = '#0A0A0E';
const PILL_TINT = withAlpha(colors.white, 0.92);
const HEART_TOP = '#FF5A9C';
const HEART_MID = '#FF425E';
const HEART_BOTTOM = '#FF2E23';
const SUBTITLE_COLOR = '#898989';
const PANEL_BG = '#FDFDFD';
const FADE_COLOR = '#F6F6F6';
const NOT_NOW_COLOR = '#1E1C22';

const CONNECTOR_LINES =
  'M 231.7 66.3 L 209.6 66.3 A 12.3 12.3 0 0 0 197.3 78.6 L 197.3 94.7 ' +
  'M 163.3 160.8 L 181.6 160.8 A 15.7 15.7 0 0 0 197.3 145.1 L 197.3 138';

const ARROWHEADS =
  'M 192 94.7 L 202.6 94.7 L 197.3 104.3 Z ' +
  'M 192.3 138 L 202.3 138 L 197.3 129 Z';

const HEART_PATH =
  'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4' +
  'c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z';

function LabelPill({
  text,
  height,
  left,
  top,
}: {
  text: string;
  height: number;
  left: number;
  top: number;
}) {
  return (
    <GlassSurface
      radius={height / 2}
      tintColor={PILL_TINT}
      style={[styles.pill, { left, top, height }]}>
      <Text style={styles.pillText}>{text}</Text>
    </GlassSurface>
  );
}

export default function AppleHealthScreen() {
  const set = useOnboarding((state) => state.set);
  const flow = useFlow('apple-health');
  const { advance } = flow;
  const insets = useSafeAreaInsets();

  const onConnect = () => {
    set('healthConnected', true);
    advance();
  };

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <View style={styles.illustration}>
          <View style={styles.circle} />
          <Svg width={393} height={235.2} style={styles.connectors} pointerEvents="none">
            <Path
              d={CONNECTOR_LINES}
              stroke={LINE_INK}
              strokeWidth={1.3}
              strokeLinecap="round"
              fill="none"
            />
            <Path d={ARROWHEADS} fill={LINE_INK} />
          </Svg>

          <LabelPill text={content.appleHealth.labelWalking} height={29.3} left={53.3} top={43} />
          <LabelPill text={content.appleHealth.labelRunning} height={30.7} left={32.7} top={82} />

          <GlassSurface
            radius={18}
            tintColor={PILL_TINT}
            style={[styles.healthCard, { left: 71.7, top: 128.7 }]}>
            <Svg width={38} height={35.15} viewBox="0 0 32 29.6" style={styles.heart}>
              <Defs>
                <SvgLinearGradient id="heartFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={HEART_TOP} />
                  <Stop offset="0.5" stopColor={HEART_MID} />
                  <Stop offset="1" stopColor={HEART_BOTTOM} />
                </SvgLinearGradient>
              </Defs>
              <Path d={HEART_PATH} fill="url(#heartFill)" />
            </Svg>
          </GlassSurface>

          <GlassSurface
            radius={18}
            tintColor={colors.ctaFill}
            fallbackColor={colors.ctaFill}
            style={[styles.quitCard, { left: 241.3, top: 26.7 }]}>
            <Icon name="leaf.fill" size={34} color={colors.white} />
          </GlassSurface>

          <LabelPill text={content.appleHealth.labelHeartRate} height={31.7} left={274.3} top={113.3} />
          <LabelPill text={content.appleHealth.labelSleep} height={30} left={250.3} top={153.3} />

          <GlassSurface
            radius={9.15}
            tintColor={colors.ctaFill}
            fallbackColor={colors.ctaFill}
            style={[styles.checkDot, { left: 188.3, top: 103 }]}>
            <Icon name="checkmark" size={9} weight="bold" color={colors.white} />
          </GlassSurface>
        </View>

        <View style={styles.titleGap} />
        <TitleBlock title={content.appleHealth.title} />
        <Text style={styles.subtitle}>{content.appleHealth.subtitle}</Text>

        <View style={styles.spacer} />

        <View style={[styles.panel, { paddingBottom: insets.bottom + 16 }]}>
          <LinearGradient
            colors={[withAlpha(FADE_COLOR, 0), FADE_COLOR]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.fade}
            pointerEvents="none"
          />
          <View style={styles.ctaWrap}>
            <PrimaryCTA title={content.common.continue} onPress={onConnect} />
          </View>
          <Pressable style={styles.notNow} onPress={advance}>
            <Text style={styles.notNowText}>{content.appleHealth.skip}</Text>
          </Pressable>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  illustration: {
    width: 393,
    height: 235.2,
    marginTop: 66,
    alignSelf: 'center',
  },
  circle: {
    position: 'absolute',
    left: 78.7,
    top: 0,
    width: 235.2,
    height: 235.2,
    borderRadius: 117.6,
    backgroundColor: colors.cardFill,
  },
  connectors: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  pill: {
    position: 'absolute',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.ink,
  },
  healthCard: {
    position: 'absolute',
    width: 81,
    height: 79.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    transform: [{ translateX: 8.8 }, { translateY: -10.7 }],
  },
  quitCard: {
    position: 'absolute',
    width: 80.3,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDot: {
    position: 'absolute',
    width: 18.3,
    height: 18.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGap: {
    height: 24,
  },
  subtitle: {
    marginTop: 24,
    paddingHorizontal: layout.margin,
    fontSize: 16,
    fontWeight: '400',
    color: SUBTITLE_COLOR,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  panel: {
    width: '100%',
    backgroundColor: PANEL_BG,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -105,
    height: 105,
  },
  ctaWrap: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 14,
  },
  notNow: {
    marginTop: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: NOT_NOW_COLOR,
  },
});
