import { useRef } from 'react';
import { Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { colors, font, shadow, withAlpha } from '@/constants/theme';

export type SystemDialogCopy = {
  title: string;
  body: string;
  allowLabel: string;
  denyLabel: string;
};

type Scheme = 'light' | 'dark';

const BOUNCE_DURATION_MS = 820;
const BOUNCE_TRAVEL = 7;
const MODERN_IOS_MAJOR = 26;

const iosMajorVersion =
  Platform.OS === 'ios' ? Number.parseInt(String(Platform.Version), 10) || 0 : 0;

const modernPalette = {
  light: {
    card: '#F7F7F9',
    title: '#000000',
    body: 'rgba(60,60,67,0.85)',
    allowFill: 'rgba(120,120,128,0.16)',
    allowText: '#000000',
    denyFill: '#007AFF',
    denyText: '#FFFFFF',
  },
  dark: {
    card: '#242428',
    title: '#FFFFFF',
    body: 'rgba(235,235,245,0.86)',
    allowFill: 'rgba(120,120,128,0.32)',
    allowText: '#FFFFFF',
    denyFill: '#0A84FF',
    denyText: '#FFFFFF',
  },
} as const;

const classicPalette = {
  light: {
    card: '#F2F2F7',
    label: '#000000',
    separator: 'rgba(60,60,67,0.36)',
    action: '#007AFF',
  },
  dark: {
    card: '#2C2C2E',
    label: '#FFFFFF',
    separator: 'rgba(84,84,88,0.65)',
    action: '#0A84FF',
  },
} as const;

const androidPalette = {
  light: {
    card: '#ECE6F0',
    title: '#1D1B20',
    body: '#49454F',
    action: '#6750A4',
  },
  dark: {
    card: '#2B2930',
    title: '#E6E0E9',
    body: '#CAC4D0',
    action: '#D0BCFF',
  },
} as const;

export function SystemDialogPreview({
  copy,
  previewLabel,
  hint,
}: {
  copy: SystemDialogCopy;
  previewLabel: string;
  hint?: string;
}) {
  const scheme: Scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const android = Platform.OS === 'android';
  const modern = !android && iosMajorVersion >= MODERN_IOS_MAJOR;

  const bounce = useSharedValue(0);
  const started = useRef<true | null>(null);

  if (started.current == null) {
    started.current = true;
    bounce.value = withRepeat(
      withTiming(1, { duration: BOUNCE_DURATION_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }

  const hintStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value * BOUNCE_TRAVEL - BOUNCE_TRAVEL / 2 }],
  }));

  return (
    <View
      accessible
      accessibilityLabel={`${previewLabel}. ${copy.title}`}
      style={[
        styles.frame,
        android ? styles.frameAndroid : modern ? styles.frameModern : styles.frameClassic,
      ]}
    >
      <View style={styles.badge}>
        <Icon name="eye" size={11} weight="semibold" color={colors.secondaryText} />
        <Text style={styles.badgeText}>{previewLabel}</Text>
      </View>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants">
        {android ? (
          <AndroidDialog copy={copy} scheme={scheme} />
        ) : modern ? (
          <ModernIosDialog copy={copy} scheme={scheme} />
        ) : (
          <ClassicIosDialog copy={copy} scheme={scheme} />
        )}
      </View>
      {hint ? (
        <Animated.View
          style={[styles.hint, android ? styles.hintRight : styles.hintLeft, hintStyle]}
        >
          <Icon name="arrowshape.up.fill" size={18} color={colors.accent} />
          <View style={styles.hintChip}>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function ModernIosDialog({ copy, scheme }: { copy: SystemDialogCopy; scheme: Scheme }) {
  const palette = modernPalette[scheme];

  return (
    <View style={[styles.modernCard, { backgroundColor: palette.card }]}>
      <Text style={[styles.modernTitle, { color: palette.title }]}>{copy.title}</Text>
      <Text style={[styles.modernBody, { color: palette.body }]}>{copy.body}</Text>
      <View style={styles.modernButtons}>
        <View style={[styles.modernButton, { backgroundColor: palette.allowFill }]}>
          <Text style={[styles.modernButtonText, { color: palette.allowText }]}>
            {copy.denyLabel}
          </Text>
        </View>
        <View style={[styles.modernButton, { backgroundColor: palette.denyFill }]}>
          <Text style={[styles.modernButtonText, { color: palette.denyText }]}>
            {copy.allowLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ClassicIosDialog({ copy, scheme }: { copy: SystemDialogCopy; scheme: Scheme }) {
  const palette = classicPalette[scheme];

  return (
    <View style={[styles.classicCard, { backgroundColor: palette.card }]}>
      <View style={styles.classicContent}>
        <Text style={[styles.classicTitle, { color: palette.label }]}>{copy.title}</Text>
        <Text style={[styles.classicBody, { color: palette.label }]}>{copy.body}</Text>
      </View>
      <View style={[styles.classicRow, { borderTopColor: palette.separator }]}>
        <View style={styles.classicAction}>
          <Text style={[styles.classicActionText, { color: palette.action }]}>
            {copy.denyLabel}
          </Text>
        </View>
        <View style={[styles.classicDivider, { backgroundColor: palette.separator }]} />
        <View style={styles.classicAction}>
          <Text
            style={[styles.classicActionText, styles.classicActionBold, { color: palette.action }]}
          >
            {copy.allowLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function AndroidDialog({ copy, scheme }: { copy: SystemDialogCopy; scheme: Scheme }) {
  const palette = androidPalette[scheme];

  return (
    <View style={[styles.androidCard, { backgroundColor: palette.card }]}>
      <Text style={[styles.androidTitle, { color: palette.title }]}>{copy.title}</Text>
      <Text style={[styles.androidBody, { color: palette.body }]}>{copy.body}</Text>
      <View style={styles.androidActions}>
        <Text style={[styles.androidActionText, { color: palette.action }]}>{copy.denyLabel}</Text>
        <Text style={[styles.androidActionText, { color: palette.action }]}>{copy.allowLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
    gap: 10,
    padding: 12,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.ring,
    backgroundColor: withAlpha(colors.white, 0.4),
  },
  frameModern: {
    maxWidth: 354,
  },
  frameClassic: {
    maxWidth: 294,
  },
  frameAndroid: {
    maxWidth: 336,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 11,
    backgroundColor: colors.cardFill,
  },
  badgeText: {
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.secondaryText,
  },
  modernCard: {
    width: '100%',
    borderRadius: 26,
    borderCurve: 'continuous',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    ...shadow.card,
  },
  modernTitle: {
    fontFamily: font.bold,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
  },
  modernBody: {
    marginTop: 12,
    fontFamily: font.regular,
    fontSize: 15.5,
    lineHeight: 21,
  },
  modernButtons: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 20,
  },
  modernButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernButtonText: {
    fontFamily: font.semibold,
    fontSize: 16,
    fontWeight: '600',
  },
  classicCard: {
    width: '100%',
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    ...shadow.card,
  },
  classicContent: {
    paddingTop: 19,
    paddingBottom: 17,
    paddingHorizontal: 16,
  },
  classicTitle: {
    fontFamily: font.semibold,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  classicBody: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
  },
  classicRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  classicAction: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classicDivider: {
    width: StyleSheet.hairlineWidth,
  },
  classicActionText: {
    fontFamily: font.regular,
    fontSize: 17,
  },
  classicActionBold: {
    fontFamily: font.semibold,
    fontWeight: '600',
  },
  androidCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    elevation: 8,
  },
  androidTitle: {
    fontFamily: font.regular,
    fontSize: 22,
    lineHeight: 28,
  },
  androidBody: {
    marginTop: 16,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  androidActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginTop: 24,
  },
  androidActionText: {
    fontFamily: font.medium,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  hint: {
    alignItems: 'center',
    gap: 2,
  },
  hintLeft: {
    alignSelf: 'flex-end',
    width: '48%',
  },
  hintRight: {
    alignSelf: 'flex-end',
    width: '36%',
  },
  hintChip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 13,
    backgroundColor: colors.accent,
    ...shadow.soft,
  },
  hintText: {
    fontFamily: font.semibold,
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});
