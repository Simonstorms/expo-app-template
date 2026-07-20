import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip, LanguagePill, ProgressBar } from './header';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { ScreenBackground } from '@/components/ui/screen-background';
import { colors, layout } from '@/constants/theme';
import type { OnboardingFlow } from '../hooks/use-flow';

export function OnboardingScaffold({
  flow,
  ctaTitle,
  ctaEnabled = true,
  showsLanguagePill = false,
  onContinue,
  footer,
  children,
}: {
  flow: OnboardingFlow;
  ctaTitle?: string | null;
  ctaEnabled?: boolean;
  showsLanguagePill?: boolean;
  onContinue?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <View style={[styles.body, { paddingTop: insets.top }]}>
        {flow.showsChrome && (
          <View style={[styles.header, { paddingRight: showsLanguagePill ? 16 : 32 }]}>
            <BackChip onPress={flow.back} />
            <ProgressBar progress={flow.progress} />
            {showsLanguagePill && <LanguagePill />}
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
            <PrimaryCTA title={ctaTitle} enabled={ctaEnabled} onPress={onContinue ?? flow.advance} />
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
    gap: 26,
    paddingLeft: 19,
    paddingTop: 8,
  },
  content: {
    flex: 1,
  },
  ctaBar: {
    backgroundColor: 'rgba(254, 254, 254, 0.94)',
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
