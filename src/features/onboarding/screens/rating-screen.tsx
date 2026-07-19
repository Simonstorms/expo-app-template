import { LinearGradient } from 'expo-linear-gradient';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { TitleBlock } from '@/components/ui/title-block';
import { colors, layout, withAlpha } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

function StarRow({ size, spacing }: { size: number; spacing: number }) {
  return (
    <View style={[styles.starRow, { gap: spacing }]}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Icon key={index} name="star.fill" size={size} color={colors.orange} />
      ))}
    </View>
  );
}

function InitialAvatar({
  letter,
  fill,
  style,
}: {
  letter: string;
  fill: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.avatarRing, style]}>
      <View style={[styles.avatarInner, { backgroundColor: fill }]}>
        <Text style={styles.avatarLetter}>{letter}</Text>
      </View>
    </View>
  );
}

export default function RatingRequestScreen() {
  const { advance } = useFlow('rating');
  const insets = useSafeAreaInsets();

  return (
    <OnboardingScaffold step="rating" ctaTitle={null}>
      <View style={styles.container}>
        <View style={styles.column}>
          <TitleBlock title="Give us a rating" />
          <View style={{ height: 18 }} />
          <GlassSurface
            radius={20}
            tintColor={withAlpha(colors.white, 0.9)}
            style={styles.laurelCard}>
            <View style={styles.laurelRow}>
              <Icon name="laurel.leading" size={55} width={64} height={55} color={colors.orange} />
              <View style={styles.laurelCenter}>
                <View style={styles.laurelScoreRow}>
                  <Text style={styles.laurelScore}>4.8</Text>
                  <StarRow size={18} spacing={4} />
                </View>
                <Text style={styles.laurelCaption}>1K+ App Ratings</Text>
              </View>
              <Icon name="laurel.trailing" size={55} width={64} height={55} color={colors.orange} />
            </View>
          </GlassSurface>
          <View style={{ height: 45 }} />
          <Text style={styles.madeFor}>{'Quit Snus was made for\npeople like you'}</Text>
          <View style={{ height: 24 }} />
          <View style={styles.avatarTrio}>
            <InitialAvatar letter="J" fill="#7C8B6F" />
            <InitialAvatar letter="S" fill="#6F7C8B" style={styles.avatarOverlap} />
            <InitialAvatar letter="M" fill="#8B6F7C" style={styles.avatarOverlap} />
          </View>
          <View style={{ height: 12 }} />
          <Text style={styles.usersCount}>10K+ Quit Snus Users</Text>
          <View style={{ height: 40 }} />
          <GlassSurface
            radius={20}
            tintColor={withAlpha(colors.cardFill, 0.85)}
            style={styles.testimonialCard}>
            <View style={styles.testimonialTop}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialAvatarLetter}>J</Text>
              </View>
              <Text style={styles.testimonialName}>Jonas K.</Text>
              <View style={styles.flexSpacer} />
              <StarRow size={13} spacing={6} />
            </View>
            <Text style={styles.testimonialQuote}>
              Two weeks in and I barely think about snus anymore. The daily plan kept me honest the
              whole way.
            </Text>
          </GlassSurface>
          <View style={{ height: 12 }} />
          <View style={styles.peekCard} />
        </View>
        <View pointerEvents="none" style={styles.scrim}>
          <LinearGradient
            colors={[withAlpha(colors.white, 0), colors.white]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.scrimGradient}
          />
          <View style={styles.scrimSolid} />
        </View>
        <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryCTA title="Continue" onPress={advance} />
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  column: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
  },
  laurelCard: {
    alignSelf: 'stretch',
    marginHorizontal: layout.margin,
    height: 95,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardStroke,
    justifyContent: 'center',
  },
  laurelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  laurelCenter: {
    alignItems: 'center',
    gap: 3,
  },
  laurelScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  laurelScore: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0E0E0E',
  },
  laurelCaption: {
    fontSize: 19,
    fontWeight: '600',
    color: '#8B8A8D',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  madeFor: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.ink,
    textAlign: 'center',
  },
  avatarTrio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 72.6,
    height: 72.6,
    borderRadius: 36.3,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    marginLeft: -14,
  },
  avatarInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  usersCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  testimonialCard: {
    alignSelf: 'stretch',
    marginHorizontal: layout.margin,
    minHeight: 142,
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 17,
  },
  testimonialTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  testimonialAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6F7C8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialAvatarLetter: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  testimonialName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1B22',
  },
  flexSpacer: {
    flex: 1,
  },
  testimonialQuote: {
    fontSize: 17,
    fontWeight: '400',
    color: '#7D7C7F',
    marginTop: 12,
  },
  peekCard: {
    alignSelf: 'stretch',
    marginHorizontal: layout.margin,
    height: 110,
    backgroundColor: '#EAE9EE',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrimGradient: {
    height: 40,
  },
  scrimSolid: {
    height: 88,
    backgroundColor: colors.white,
  },
  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.ctaMargin,
  },
});
