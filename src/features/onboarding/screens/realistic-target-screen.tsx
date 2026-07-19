import { StyleSheet, Text, View } from 'react-native';

import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { colors, text } from '@/constants/theme';

export default function RealisticTargetScreen() {
  return (
    <OnboardingScaffold step="realistic-target" ctaTitle="Continue">
      <View style={styles.container}>
        <Text style={styles.headline}>
          Quitting in <Text style={styles.highlight}>90 days</Text> is a realistic target. It’s not hard at
          all!
        </Text>
        <Text style={styles.caption}>
          90% of users say cravings fade noticeably after the first week with Quit Snus.
        </Text>
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
