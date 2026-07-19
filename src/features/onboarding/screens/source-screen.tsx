import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';

import {
  FacebookLogo,
  GoogleLogo,
  InstagramLogo,
  TikTokLogo,
  YouTubeLogo,
} from '@/components/ui/brand-logos';
import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, text, withAlpha } from '@/constants/theme';
import { type DiscoverySource, sourceOptions } from '../types';
import { useFlow } from '../hooks/use-flow';

export default function DiscoverySourceScreen() {
  const source = useOnboarding((state) => state.discoverySource);
  const set = useOnboarding((state) => state.set);
  const { selectAndAdvance } = useFlow('source');

  return (
    <OnboardingScaffold step="source" ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title="Where did you hear about us?" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <GlassGroup spacing={12.3} style={styles.group}>
            {sourceOptions.map((option) => (
              <SourceRow
                key={option.id}
                source={option.id}
                label={option.label}
                selected={source === option.id}
                onPress={() => selectAndAdvance(() => set('discoverySource', option.id))}
              />
            ))}
          </GlassGroup>
        </ScrollView>
      </View>
    </OnboardingScaffold>
  );
}

function SourceRow({
  source,
  label,
  selected,
  onPress,
}: {
  source: DiscoverySource;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useDerivedValue(() => withSpring(selected ? 1.015 : 1, { damping: 15, stiffness: 220 }));
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress}>
        <GlassSurface
          radius={layout.cardRadius}
          tintColor={selected ? colors.ink : withAlpha(colors.cardFill, 0.85)}
          isInteractive>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <SourceGlyph source={source} />
            </View>
            <Text style={[text.row, { color: selected ? colors.white : colors.ink }]}>{label}</Text>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  );
}

function SourceGlyph({ source }: { source: DiscoverySource }) {
  switch (source) {
    case 'instagram':
      return <InstagramLogo size={27} />;
    case 'tiktok':
      return <TikTokLogo size={27} />;
    case 'facebook':
      return <FacebookLogo size={27} />;
    case 'youtube':
      return <YouTubeLogo size={27} />;
    case 'google':
      return <GoogleLogo size={23} />;
    case 'tv':
      return <Icon name="tv" size={17} weight="semibold" color={colors.ink} />;
    case 'friends':
      return <Icon name="person.3.fill" size={13} color={colors.ctaFill} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  group: {
    paddingHorizontal: layout.margin,
    paddingTop: 31,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 16,
    height: 70,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
