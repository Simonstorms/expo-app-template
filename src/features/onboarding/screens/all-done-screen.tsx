import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { GradientRing } from '@/components/ui/gradient-ring';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

type SparkleMark = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

const SPARKLE_POINTS: [number, number, number][] = [
  [-33, -66.5, 38],
  [44, -65.8, 55],
  [-58.3, -45.5, 31],
  [71, -27.2, 47],
  [-76.6, -26.2, 59],
  [-66, 3.8, 36],
  [74.7, 15.8, 52],
  [-73.6, 22.8, 43],
  [49.7, 38.2, 34],
];

const SPARKLE_MARKS: SparkleMark[] = SPARKLE_POINTS.map(([x, y, rotation], index) => ({
  id: index,
  x,
  y,
  rotation,
}));

export default function AllDoneScreen() {
  const flow = useFlow('all-done');
  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <View style={styles.illustrationWrap}>
          <GradientRing diameter={235} ringWidth={33}>
            <View style={styles.stage}>
              <Text style={styles.emoji}>🫰</Text>
              <Icon
                name="heart.fill"
                size={16}
                color="#E36778"
                style={styles.heartIcon}
              />
              {SPARKLE_MARKS.map((mark) => (
                <View
                  key={mark.id}
                  style={[
                    styles.sparkle,
                    {
                      left: 101 + mark.x - 2,
                      top: 101 + mark.y - 2,
                      transform: [{ rotate: `${mark.rotation}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </GradientRing>
        </View>
        <View style={styles.doneRow}>
          <SymbolView
            name="checkmark.circle.fill"
            type="palette"
            colors={[colors.white, '#34C759']}
            size={18}
            resizeMode="scaleAspectFit"
            style={styles.checkIcon}
          />
          <Text style={styles.doneLabel}>{content.allDone.doneLabel}</Text>
        </View>
        <Text style={styles.title}>{content.allDone.title}</Text>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationWrap: {
    marginTop: 87,
  },
  stage: {
    width: 202,
    height: 202,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 94,
    transform: [{ translateX: 4 }, { translateY: 13 }],
  },
  heartIcon: {
    position: 'absolute',
    left: 101,
    top: 41,
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 0.8,
    backgroundColor: '#1C1A25',
  },
  doneRow: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  checkIcon: {
    width: 18,
    height: 18,
  },
  doneLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
  },
  title: {
    marginTop: 21,
    width: '100%',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#1C1A25',
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
});
