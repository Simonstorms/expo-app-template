import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icon';
import { colors, font, withAlpha } from '@/constants/theme';

export type TimelineStep = {
  title: string;
  caption?: string;
  symbol?: IconName;
  color?: string;
};

export function TrialTimeline({
  steps,
  titleColor = colors.ink,
  captionColor = colors.secondaryText,
  defaultColor = colors.accent,
}: {
  steps: readonly TimelineStep[];
  titleColor?: string;
  captionColor?: string;
  defaultColor?: string;
}) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const nodeColor = step.color ?? defaultColor;
        return (
          <View key={step.title} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.node, { backgroundColor: nodeColor }]}>
                {step.symbol ? (
                  <Icon name={step.symbol} size={18} weight="bold" color={colors.white} />
                ) : (
                  <View style={styles.dot} />
                )}
              </View>
              {isLast ? null : (
                <View style={[styles.line, { backgroundColor: withAlpha(nodeColor, 0.45) }]} />
              )}
            </View>
            <View style={styles.body}>
              <Text style={[styles.title, { color: titleColor }]}>{step.title}</Text>
              {step.caption ? (
                <Text style={[styles.caption, { color: captionColor }]}>{step.caption}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rail: {
    alignItems: 'center',
    width: 40,
  },
  node: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  line: {
    width: 3,
    flex: 1,
    minHeight: 26,
    borderRadius: 1.5,
    marginVertical: 2,
  },
  body: {
    flex: 1,
    paddingBottom: 26,
    paddingTop: 2,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 14,
    fontFamily: font.regular,
    fontWeight: '400',
    lineHeight: 19,
  },
});
