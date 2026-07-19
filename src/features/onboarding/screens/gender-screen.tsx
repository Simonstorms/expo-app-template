import { StyleSheet, View } from 'react-native';

import { GlassGroup } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { SelectionRow } from '@/components/ui/selection-row';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { layout } from '@/constants/theme';
import { genderOptions } from '../types';
import { useFlow } from '../hooks/use-flow';

export default function GenderScreen() {
  const gender = useOnboarding((state) => state.gender);
  const set = useOnboarding((state) => state.set);
  const { selectAndAdvance } = useFlow('gender');

  return (
    <OnboardingScaffold step="gender" ctaTitle={null} showsLanguagePill>
      <View style={styles.container}>
        <TitleBlock
          title="Choose your Gender"
          subtitle={'This will be used to calibrate your\ncustom plan.'}
        />
        <View style={styles.spacer} />
        <GlassGroup spacing={11} style={styles.group}>
          {genderOptions.map((option) => (
            <SelectionRow
              key={option.id}
              title={option.label}
              centered
              selected={gender === option.id}
              onPress={() => selectAndAdvance(() => set('gender', option.id))}
            />
          ))}
        </GlassGroup>
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
    minHeight: 24,
  },
  group: {
    paddingHorizontal: layout.margin,
  },
});
