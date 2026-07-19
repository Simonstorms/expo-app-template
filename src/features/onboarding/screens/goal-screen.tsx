import { StyleSheet, View } from 'react-native';

import { GlassGroup } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { SelectionRow } from '@/components/ui/selection-row';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { layout } from '@/constants/theme';
import { goalOptions } from '../types';
import { useFlow } from '../hooks/use-flow';

export default function GoalScreen() {
  const goal = useOnboarding((state) => state.goal);
  const set = useOnboarding((state) => state.set);
  const { selectAndAdvance } = useFlow('goal');

  return (
    <OnboardingScaffold step="goal" ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock
          title="What is your goal?"
          subtitle="This helps us generate your personalized quit plan."
        />
        <View style={styles.spacer} />
        <GlassGroup spacing={22} style={styles.group}>
          {goalOptions.map((option) => (
            <SelectionRow
              key={option.id}
              title={option.label}
              height={60}
              selected={goal === option.id}
              onPress={() => selectAndAdvance(() => set('goal', option.id))}
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
    minHeight: 0,
  },
  group: {
    paddingHorizontal: layout.margin,
  },
});
