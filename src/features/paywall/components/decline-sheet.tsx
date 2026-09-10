import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { PrimaryCTA } from '@/components/ui/primary-cta';
import { content } from '@/constants/content';
import { colors, font, layout, withAlpha } from '@/constants/theme';

import { TrialCard } from './trial-card';

export type DeclineReason = 'price' | 'unsure' | 'browsing';

export type SheetState = 'none' | 'reason' | 'reassure';

const declineOptions: { reason: DeclineReason; emoji: string; label: string }[] = [
  { reason: 'price', emoji: '💸', label: content.paywall.decline.price },
  { reason: 'unsure', emoji: '🤔', label: content.paywall.decline.unsure },
  { reason: 'browsing', emoji: '👀', label: content.paywall.decline.browsing },
];

function ReasonBody({ onChooseReason }: { onChooseReason: (reason: DeclineReason) => void }) {
  return (
    <>
      <Text style={styles.sheetTitle}>{content.paywall.decline.title}</Text>
      <Text style={styles.sheetSubtitle}>{content.paywall.decline.subtitle}</Text>
      <View style={styles.sheetOptions}>
        {declineOptions.map((option) => (
          <Pressable
            key={option.reason}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            style={styles.sheetOption}
            onPress={() => onChooseReason(option.reason)}
          >
            <Text style={styles.sheetOptionEmoji}>{option.emoji}</Text>
            <Text style={styles.sheetOptionLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function ReassureBody({
  busy,
  trialReady,
  yearlyPrice,
  onStartTrial,
  onClose,
}: {
  busy: boolean;
  trialReady: boolean;
  yearlyPrice: string;
  onStartTrial: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <Text style={styles.sheetTitle}>{content.paywall.decline.reassureTitle}</Text>
      <TrialCard />
      <PrimaryCTA
        title={content.paywall.ctaTrial}
        enabled={!busy && trialReady}
        onPress={onStartTrial}
      />
      {trialReady ? (
        <Text style={styles.disclosure}>{content.paywall.trialTerms(yearlyPrice, 'year')}</Text>
      ) : null}
      <Pressable accessibilityRole="button" hitSlop={8} onPress={onClose}>
        <Text style={styles.sheetLater}>{content.paywall.decline.later}</Text>
      </Pressable>
    </>
  );
}

export function DeclineSheet({
  sheet,
  busy,
  trialReady,
  yearlyPrice,
  onClose,
  onChooseReason,
  onStartTrial,
}: {
  sheet: SheetState;
  busy: boolean;
  trialReady: boolean;
  yearlyPrice: string;
  onClose: () => void;
  onChooseReason: (reason: DeclineReason) => void;
  onStartTrial: () => void;
}) {
  return (
    <Modal transparent visible={sheet !== 'none'} animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={content.paywall.decline.later}
          style={styles.sheetScrim}
          onPress={onClose}
        />
        <Animated.View entering={SlideInDown.duration(300)} style={styles.sheetCard}>
          <View style={styles.sheetHandle} />
          {sheet === 'reason' ? (
            <ReasonBody onChooseReason={onChooseReason} />
          ) : (
            <ReassureBody
              busy={busy}
              trialReady={trialReady}
              yearlyPrice={yearlyPrice}
              onStartTrial={onStartTrial}
              onClose={onClose}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  disclosure: {
    fontSize: 11,
    fontFamily: font.regular,
    color: colors.tertiaryText,
    textAlign: 'center',
    lineHeight: 15,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withAlpha(colors.ink, 0.35),
  },
  sheetCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderCurve: 'continuous',
    paddingTop: 10,
    paddingHorizontal: layout.margin,
    paddingBottom: 40,
    gap: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: withAlpha(colors.ink, 0.14),
  },
  sheetTitle: {
    fontSize: 24,
    fontFamily: font.bold,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  sheetOptions: {
    gap: 10,
    marginTop: 6,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: layout.rowRadius,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: withAlpha(colors.ink, 0.1),
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  sheetOptionEmoji: {
    fontSize: 20,
  },
  sheetOptionLabel: {
    fontSize: 15.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  sheetLater: {
    fontSize: 14.5,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: withAlpha(colors.ink, 0.5),
    textAlign: 'center',
    paddingVertical: 4,
  },
});
