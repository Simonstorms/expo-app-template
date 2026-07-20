import { StyleSheet, View } from 'react-native';

import { GlassGroup } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { SelectionRow } from '@/components/ui/selection-row';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { content } from '@/constants/content';
import { layout } from '@/constants/theme';
import { useFlow } from '../hooks/use-flow';

export default function GoalScreen() {
  const goal = useOnboarding((state) => state.goal);
  const set = useOnboarding((state) => state.set);
  const flow = useFlow('goal');
  const { selectAndAdvance } = flow;

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock
          title={content.goal.title}
          subtitle={content.goal.subtitle}
        />
        <View style={styles.spacer} />
        <GlassGroup spacing={22} style={styles.group}>
          {content.goal.options.map((option) => (
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
