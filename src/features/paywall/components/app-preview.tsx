import { StyleSheet, Text, View } from 'react-native';

import { PhoneMockup } from '@/components/ui/phone-mockup';
import { content } from '@/constants/content';
import { colors, font } from '@/constants/theme';

const PREVIEW_WIDTH = 172;

export function AppPreview() {
  const { mock } = content.paywall;
  const stats = [
    { value: mock.unitsValue, label: mock.unitsLabel },
    { value: mock.savedValue, label: mock.savedLabel },
    { value: mock.healthValue, label: mock.healthLabel },
  ];

  return (
    <PhoneMockup width={PREVIEW_WIDTH}>
      <View style={styles.preview}>
        <Text style={styles.previewWordmark} numberOfLines={1}>
          {mock.wordmark}
        </Text>
        <View style={styles.previewHero}>
          <Text style={styles.previewHeroValue}>{mock.daysValue}</Text>
          <Text style={styles.previewHeroLabel} numberOfLines={1}>
            {mock.daysLabel}
          </Text>
        </View>
        <View style={styles.previewStatRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.previewStat}>
              <Text style={styles.previewStatValue} numberOfLines={1} adjustsFontSizeToFit>
                {stat.value}
              </Text>
              <Text style={styles.previewStatLabel} numberOfLines={1}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.previewSection}>{mock.recent}</Text>
        <View style={styles.previewRow}>
          <View style={styles.previewRowHeader}>
            <Text style={styles.previewRowTitle} numberOfLines={1}>
              {mock.checkinTitle}
            </Text>
            <Text style={styles.previewRowTime}>{mock.checkinTime}</Text>
          </View>
          <Text style={styles.previewRowDetail} numberOfLines={1}>
            {mock.checkinStat}
          </Text>
        </View>
      </View>
    </PhoneMockup>
  );
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 26,
  },
  previewWordmark: {
    fontSize: 13,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.ink,
  },
  previewHero: {
    marginTop: 12,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 2,
  },
  previewHeroValue: {
    fontSize: 26,
    fontFamily: font.bold,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.ink,
  },
  previewHeroLabel: {
    fontSize: 10,
    fontFamily: font.medium,
    color: colors.secondaryText,
  },
  previewStatRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  previewStat: {
    flex: 1,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 9,
    paddingHorizontal: 6,
    gap: 2,
  },
  previewStatValue: {
    fontSize: 12,
    fontFamily: font.bold,
    fontWeight: '700',
    color: colors.ink,
  },
  previewStatLabel: {
    fontSize: 8,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
  previewSection: {
    marginTop: 14,
    fontSize: 11,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  previewRow: {
    marginTop: 7,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.cardFill,
    paddingVertical: 9,
    paddingHorizontal: 10,
    gap: 3,
  },
  previewRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewRowTitle: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  previewRowTime: {
    fontSize: 8,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
  previewRowDetail: {
    fontSize: 8.5,
    fontFamily: font.regular,
    color: colors.secondaryText,
  },
});
