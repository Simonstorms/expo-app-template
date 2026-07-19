import { LinearGradient } from 'expo-linear-gradient';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signOut } from '@/features/auth/api';
import { useSession } from '@/features/auth/hooks/use-session';
import { restorePurchases } from '@/features/paywall/api';
import { useEntitlement } from '@/features/paywall/hooks/use-entitlement';
import { GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { backgroundGradient, colors, withAlpha } from '@/constants/theme';

const dangerRed = '#DC6868';

type Row = {
  symbol: string;
  label: string;
  value?: string;
  tint?: string;
  onPress: () => void;
};

type Section = {
  key: string;
  title?: string;
  rows: Row[];
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const { isPro } = useEntitlement();
  const noop = () => {};

  const sections: Section[] = [
    {
      key: 'account',
      title: 'Account',
      rows: [
        {
          symbol: 'person.crop.circle.fill',
          label: 'Signed in',
          value: user?.email ?? 'Guest',
          onPress: noop,
        },
      ],
    },
    {
      key: 'subscription',
      title: 'Subscription',
      rows: [
        { symbol: 'crown.fill', label: 'Quit Snus Pro', value: isPro ? 'Active' : 'Free', onPress: noop },
        {
          symbol: 'arrow.clockwise',
          label: 'Restore purchases',
          onPress: () => {
            void restorePurchases();
          },
        },
      ],
    },
    {
      key: 'preferences',
      title: 'Preferences',
      rows: [
        { symbol: 'bell.fill', label: 'Notifications', onPress: noop },
        { symbol: 'clock.fill', label: 'Reminders', onPress: noop },
      ],
    },
    {
      key: 'about',
      title: 'About',
      rows: [
        { symbol: 'lock.fill', label: 'Privacy Policy', onPress: noop },
        { symbol: 'doc.text.fill', label: 'Terms of Service', onPress: noop },
        { symbol: 'star.fill', label: 'Rate Quit Snus', onPress: noop },
      ],
    },
    {
      key: 'danger',
      rows: [
        {
          symbol: 'rectangle.portrait.and.arrow.right',
          label: 'Sign out',
          onPress: () => {
            void signOut();
          },
        },
        { symbol: 'trash.fill', label: 'Delete account', tint: dangerRed, onPress: noop },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={backgroundGradient.colors}
        locations={backgroundGradient.locations}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}>
        <Text style={styles.screenTitle}>Settings</Text>
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            {section.title ? <Text style={styles.sectionLabel}>{section.title}</Text> : null}
            <GlassSurface radius={16} tintColor={withAlpha(colors.white, 0.85)} style={styles.card}>
              {section.rows.map((row, index) => (
                <Fragment key={row.label}>
                  <SettingRow row={row} />
                  {index < section.rows.length - 1 ? <View style={styles.divider} /> : null}
                </Fragment>
              ))}
            </GlassSurface>
          </View>
        ))}
        <Text style={styles.version}>Quit Snus · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SettingRow({ row }: { row: Row }) {
  const tint = row.tint ?? colors.ink;
  return (
    <Pressable
      onPress={row.onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.rowIcon, { backgroundColor: withAlpha(tint, 0.1) }]}>
        <Icon name={row.symbol} size={15} weight="semibold" color={tint} />
      </View>
      <Text style={[styles.rowLabel, { color: tint }]}>{row.label}</Text>
      <View style={styles.rowRight}>
        {row.value ? <Text style={styles.rowValue}>{row.value}</Text> : null}
        <Icon name="chevron.right" size={13} weight="semibold" color={colors.disabledFill} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.ink,
    marginBottom: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 9,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.secondaryText,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 14,
    height: 54,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  rowValue: {
    fontSize: 15,
    color: colors.secondaryText,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 57,
    backgroundColor: colors.hairline,
  },
  version: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
    color: colors.disabledFill,
  },
});
