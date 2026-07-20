import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, text } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

export default function RealisticTargetScreen() {
  const flow = useFlow('realistic-target');
  const [headlineStart, headlineEnd = ''] = content.realisticTarget.headline.split(
    content.realisticTarget.headlineHighlight,
  );

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <Text style={styles.headline}>
          {headlineStart}
          <Text style={styles.highlight}>{content.realisticTarget.headlineHighlight}</Text>
          {headlineEnd}
        </Text>
        <Text style={styles.caption}>{content.realisticTarget.caption}</Text>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    paddingBottom: 10,
  },
  headline: {
    ...text.title,
    maxWidth: 294,
    textAlign: 'center',
  },
  highlight: {
    color: colors.orange,
  },
  caption: {
    maxWidth: 285,
    fontSize: 16,
    fontWeight: '400',
    color: colors.ink,
    textAlign: 'center',
  },
});
