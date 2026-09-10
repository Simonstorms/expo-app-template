import { StyleSheet, View } from 'react-native';

import { TrialTimeline } from '@/components/ui/trial-timeline';
import type { TimelineStep } from '@/components/ui/trial-timeline';
import { content } from '@/constants/content';
import { colors, layout, shadow } from '@/constants/theme';

const timelineSteps: TimelineStep[] = content.paywall.timeline.map((step) => ({
  title: step.title,
  caption: step.body,
  symbol: step.icon,
}));

export function TrialCard() {
  return (
    <View style={styles.timelineCard}>
      <TrialTimeline steps={timelineSteps} />
    </View>
  );
}

const styles = StyleSheet.create({
  timelineCard: {
    marginTop: 18,
    borderRadius: layout.cardRadius,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.cardStroke,
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingBottom: 2,
    paddingHorizontal: 16,
    ...shadow.soft,
  },
});
