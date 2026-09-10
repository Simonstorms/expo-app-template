import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icon';
import { colors, font, shadow } from '@/constants/theme';

export function NotificationPreview({
  title,
  body,
  time,
  symbol = 'bell.fill',
  iconColor = colors.accent,
  icon,
}: {
  title: string;
  body: string;
  time?: string;
  symbol?: IconName;
  iconColor?: string;
  icon?: ReactNode;
}) {
  return (
    <View style={[styles.card, shadow.soft]}>
      <View style={[styles.appIcon, { backgroundColor: iconColor }]}>
        {icon ?? <Icon name={symbol} size={20} weight="bold" color={colors.white} />}
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {time ? <Text style={styles.time}>{time}</Text> : null}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.cardStroke,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  appIcon: {
    width: 38,
    height: 38,
    borderRadius: 9.5,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  time: {
    fontSize: 12,
    fontFamily: font.regular,
    fontWeight: '400',
    color: colors.secondaryText,
  },
  message: {
    fontSize: 13.5,
    fontFamily: font.regular,
    fontWeight: '400',
    color: colors.secondaryText,
    lineHeight: 18,
  },
});
