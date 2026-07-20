import { StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { GradientRing } from '@/components/ui/gradient-ring';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

type ConfettiMark = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

const CONFETTI_POINTS: [number, number][] = [
  [-17.3, -76],
  [45.7, -62],
  [-46.3, -62],
  [-61.3, -42],
  [-77.3, -22],
  [-63.3, -19],
  [76.7, -10],
  [-76.3, -9],
  [-74.3, 13],
  [75.7, 21],
  [-74.3, 26],
  [59.7, 53],
  [47.7, 59],
  [-39.3, 62],
  [-7.3, 74],
  [18.7, 79],
];

const CONFETTI_MARKS: ConfettiMark[] = CONFETTI_POINTS.map(([x, y], index) => ({
  id: index,
  x,
  y,
  rotation: ((index * 37) % 90) - 45,
}));

export default function TrustPrivacyScreen() {
  const flow = useFlow('trust-privacy');

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <View style={styles.illustrationWrap}>
          <GradientRing diameter={201} ringWidth={33}>
            <View style={styles.confettiStage}>
              <Text style={styles.emoji}>🙌</Text>
              {CONFETTI_MARKS.map((mark) => (
                <View
                  key={mark.id}
                  style={[
                    styles.confettiMark,
                    {
                      left: 84 + mark.x - 1.5,
                      top: 84 + mark.y - 1.5,
                      transform: [{ rotate: `${mark.rotation}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </GradientRing>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{content.trustPrivacy.title}</Text>
          <Text style={styles.titleSubtitle}>{content.trustPrivacy.subtitle}</Text>
        </View>
        <View style={styles.cardOuter}>
          <View style={styles.cardShell}>
            <GlassSurface
              radius={layout.cardRadius}
              tintColor={withAlpha('#F7F6FB', 0.85)}
              style={styles.cardSurface}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{content.trustPrivacy.cardTitle}</Text>
                <Text style={styles.cardCaption}>{content.trustPrivacy.cardCaption}</Text>
              </View>
            </GlassSurface>
            <View style={styles.badgeWrap}>
              <LockSealBadge />
            </View>
          </View>
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

function LockSealBadge() {
  return (
    <View style={styles.badge}>
      <Icon name="seal.fill" size={49} color={colors.white} style={styles.badgeIconOuter} />
      <Icon name="seal.fill" size={43} color="#EAE6F2" style={styles.badgeIconInner} />
      <View style={styles.badgeEmojiWrap}>
        <Text style={styles.badgeEmoji}>🔒</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationWrap: {
    marginTop: 67,
  },
  confettiStage: {
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 84,
  },
  confettiMark: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 0.8,
    backgroundColor: '#0F0E12',
  },
  titleWrap: {
    marginTop: 57,
    width: '100%',
    alignItems: 'center',
    gap: 13,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#17151D',
    textAlign: 'center',
  },
  titleSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8D8D8E',
    textAlign: 'center',
  },
  cardOuter: {
    width: '100%',
    marginTop: 48,
    paddingHorizontal: 38,
  },
  cardShell: {
    position: 'relative',
    width: '100%',
  },
  cardSurface: {
    width: '100%',
  },
  cardContent: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 15,
    paddingHorizontal: 16,
    gap: 7,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15131A',
    textAlign: 'center',
  },
  cardCaption: {
    fontSize: 13,
    fontWeight: '400',
    color: '#0A0A0A',
    textAlign: 'center',
  },
  badgeWrap: {
    position: 'absolute',
    top: -29,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    width: 49,
    height: 49,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeIconOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  badgeIconInner: {
    position: 'absolute',
    top: 3,
    left: 3,
  },
  badgeEmojiWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 15,
    transform: [{ translateY: 2 }],
  },
  spacer: {
    flex: 1,
  },
});
