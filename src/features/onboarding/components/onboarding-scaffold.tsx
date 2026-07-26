import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryCTA, type CtaVariant } from '@/components/ui/primary-cta';
import { ScreenBackground, type BackgroundVariant } from '@/components/ui/screen-background';
import { colors, layout, withAlpha } from '@/constants/theme';
import type { OnboardingFlow } from '../hooks/use-flow';
import { BackChip, LanguagePill, ProgressBar, SkipLink } from './header';

const SKIP_SPACER_WIDTH = 34;

export function OnboardingScaffold({
  flow,
  variant = 'light',
  ctaTitle,
  ctaVariant = 'primary',
  ctaEnabled = true,
  showsLanguagePill = false,
  onBack,
  onSkip,
  skipLabel,
  onContinue,
  footer,
  children,
}: {
  flow: OnboardingFlow;
  variant?: BackgroundVariant;
  ctaTitle?: string | null;
  ctaVariant?: CtaVariant;
  ctaEnabled?: boolean;
  showsLanguagePill?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  onContinue?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const chipTone = variant === 'light' ? 'light' : 'translucent';

  return (
    <View style={styles.root}>
      <ScreenBackground variant={variant} />
      <View style={[styles.body, { paddingTop: insets.top }]}>
        {flow.showsChrome && (
          <View style={styles.header}>
            {onBack || flow.canGoBack ? (
              <BackChip onPress={onBack ?? flow.back} tone={chipTone} />
            ) : (
              <View style={styles.backSpacer} />
            )}
            <ProgressBar progress={flow.progress} />
            {showsLanguagePill ? <LanguagePill /> : null}
            {onSkip && skipLabel ? (
              <SkipLink onPress={onSkip} label={skipLabel} />
            ) : showsLanguagePill ? null : (
              <View style={styles.skipSpacer} />
            )}
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
      {footer ? (
        <View style={{ paddingBottom: insets.bottom }}>{footer}</View>
      ) : ctaTitle ? (
        <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.hairline} />
          <View style={styles.ctaInner}>
            <PrimaryCTA
              title={ctaTitle}
              variant={ctaVariant}
              enabled={ctaEnabled}
              onPress={onContinue ?? flow.advance}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingLeft: 19,
    paddingRight: 16,
    paddingTop: 8,
  },
  backSpacer: {
    width: layout.chipSize,
  },
  skipSpacer: {
    width: SKIP_SPACER_WIDTH,
  },
  content: {
    flex: 1,
  },
  ctaBar: {
    backgroundColor: withAlpha(colors.white, 0.94),
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
  ctaInner: {
    paddingHorizontal: layout.ctaMargin,
    paddingTop: 15,
  },
});
