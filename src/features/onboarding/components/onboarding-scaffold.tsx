import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryCTA } from '@/components/ui/primary-cta';
import type { CtaVariant } from '@/components/ui/primary-cta';
import { ScreenBackground } from '@/components/ui/screen-background';
import type { BackgroundVariant } from '@/components/ui/screen-background';
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
            <HeaderTrailing
              onSkip={onSkip}
              skipLabel={skipLabel}
              hasLanguagePill={showsLanguagePill}
            />
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
      <ScaffoldFooter
        footer={footer}
        ctaTitle={ctaTitle}
        ctaVariant={ctaVariant}
        ctaEnabled={ctaEnabled}
        onContinue={onContinue ?? flow.advance}
        bottomInset={insets.bottom}
      />
    </View>
  );
}

function HeaderTrailing({
  onSkip,
  skipLabel,
  hasLanguagePill,
}: {
  onSkip?: () => void;
  skipLabel?: string;
  hasLanguagePill: boolean;
}) {
  if (onSkip && skipLabel) {
    return <SkipLink onPress={onSkip} label={skipLabel} />;
  }
  if (hasLanguagePill) {
    return null;
  }
  return <View style={styles.skipSpacer} />;
}

function ScaffoldFooter({
  footer,
  ctaTitle,
  ctaVariant,
  ctaEnabled,
  onContinue,
  bottomInset,
}: {
  footer?: ReactNode;
  ctaTitle?: string | null;
  ctaVariant: CtaVariant;
  ctaEnabled: boolean;
  onContinue: () => void;
  bottomInset: number;
}) {
  if (footer) {
    return <View style={{ paddingBottom: bottomInset }}>{footer}</View>;
  }
  if (!ctaTitle) {
    return null;
  }
  return (
    <View style={[styles.ctaBar, { paddingBottom: bottomInset + 8 }]}>
      <View style={styles.hairline} />
      <View style={styles.ctaInner}>
        <PrimaryCTA
          title={ctaTitle}
          variant={ctaVariant}
          enabled={ctaEnabled}
          onPress={onContinue}
        />
      </View>
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
