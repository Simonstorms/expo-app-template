import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, font, layout, shadow, withAlpha } from '@/constants/theme';

export function PlanOption({
  title,
  price,
  sub,
  subStruck = false,
  badge,
  selected,
  onPress,
}: {
  title: string;
  price: string;
  sub?: string | null;
  subStruck?: boolean;
  badge?: string | null;
  selected: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={sub ? `${title}, ${price}, ${sub}` : `${title}, ${price}`}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.planOption, selected ? styles.planOptionSelected : null]}
    >
      <View style={styles.planOptionRow}>
        <Text style={styles.planOptionTitle}>{title}</Text>
        {badge ? (
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.planOptionRow}>
        <Text style={styles.planOptionPrice}>{price}</Text>
        {sub ? (
          <Text style={[styles.planOptionSub, subStruck ? styles.planOptionSubStruck : null]}>
            {sub}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  planOption: {
    borderRadius: layout.rowRadius,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: withAlpha(colors.ink, 0.1),
    backgroundColor: colors.white,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 5,
  },
  planOptionSelected: {
    borderColor: colors.ink,
    ...shadow.soft,
  },
  planOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planOptionTitle: {
    fontSize: 16,
    fontFamily: font.bold,
    fontWeight: '700',
    color: colors.ink,
  },
  planOptionPrice: {
    fontSize: 15,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  planOptionSub: {
    fontSize: 13.5,
    fontFamily: font.medium,
    color: colors.secondaryText,
  },
  planOptionSubStruck: {
    textDecorationLine: 'line-through',
  },
  planBadge: {
    borderRadius: 999,
    backgroundColor: colors.ink,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  planBadgeText: {
    fontSize: 11,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.white,
  },
});
