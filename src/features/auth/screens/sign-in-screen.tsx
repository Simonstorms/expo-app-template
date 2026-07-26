import * as AppleAuthentication from 'expo-apple-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { GoogleLogo } from '@/components/ui/brand-logos';
import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { TitleBlock } from '@/components/ui/title-block';
import { brand } from '@/constants/brand';
import { hasSupabase } from '@/constants/config';
import { content } from '@/constants/content';
import { colors, font, withAlpha } from '@/constants/theme';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { useFlow } from '@/features/onboarding/hooks/use-flow';
import { captureEvent } from '@/lib/analytics';
import { AuthCancelledError, signInWithApple, signInWithGoogle } from '../api';
import { useSession } from '../hooks/use-session';

const BUTTON_HEIGHT = 62;
const BUTTON_RADIUS = 31;

type SignInOutcome = 'succeeded' | 'cancelled' | 'failed';

async function runSignIn(signIn: () => Promise<void>): Promise<SignInOutcome> {
  try {
    await signIn();
    return 'succeeded';
  } catch (error) {
    return error instanceof AuthCancelledError ? 'cancelled' : 'failed';
  }
}

function openUrl(url: string): void {
  void Linking.openURL(url).catch(() => undefined);
}

export default function SignInScreen() {
  const flow = useFlow('sign-in');
  const { advance } = flow;
  const { isSignedIn } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advancedRef = useRef(false);

  const advanceOnce = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    advance();
  }, [advance]);

  useEffect(() => {
    if (isSignedIn) advanceOnce();
  }, [isSignedIn, advanceOnce]);

  const start = (signIn: () => Promise<void>, provider: string) => {
    if (busy || advancedRef.current) return;
    setBusy(true);
    setError(null);
    void runSignIn(signIn).then((outcome) => {
      setBusy(false);
      if (outcome === 'cancelled') return;
      if (outcome === 'failed') {
        setError(content.signIn.error);
        captureEvent('sign_in_failed', { provider });
        return;
      }
      captureEvent('sign_in_succeeded', { provider });
      if (!hasSupabase) advanceOnce();
    });
  };

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title={content.signIn.title} subtitle={content.signIn.subtitle} />
        <View style={styles.topSpacer} />
        <GlassGroup spacing={16} style={styles.buttons}>
          {Platform.OS === 'ios' ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={BUTTON_RADIUS}
              style={[styles.appleButton, busy ? styles.dimmed : null]}
              onPress={() => start(signInWithApple, 'apple')}
            />
          ) : null}
          <GoogleButton disabled={busy} onPress={() => start(signInWithGoogle, 'google')} />
        </GlassGroup>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.legal}>
          {content.signIn.legalPrefix}{' '}
          <Text
            accessibilityRole="link"
            style={styles.legalLink}
            onPress={() => openUrl(brand.legal.termsUrl)}
          >
            {content.signIn.legalTerms}
          </Text>{' '}
          {content.signIn.legalAnd}{' '}
          <Text
            accessibilityRole="link"
            style={styles.legalLink}
            onPress={() => openUrl(brand.legal.privacyUrl)}
          >
            {content.signIn.legalPrivacy}
          </Text>
        </Text>
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function GoogleButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={content.signIn.google}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={disabled ? styles.dimmed : undefined}
    >
      <GlassSurface
        radius={BUTTON_RADIUS}
        tintColor={withAlpha(colors.white, 0.92)}
        isInteractive
        style={[styles.button, styles.outlined]}
      >
        <GoogleLogo size={24} />
        <Text style={styles.darkLabel}>{content.signIn.google}</Text>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    flex: 1,
    minHeight: 24,
    maxHeight: 180,
  },
  buttons: {
    paddingHorizontal: 40,
  },
  button: {
    height: BUTTON_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 21,
  },
  appleButton: {
    height: BUTTON_HEIGHT,
  },
  dimmed: {
    opacity: 0.55,
  },
  outlined: {
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1.7,
    borderColor: colors.ink,
  },
  darkLabel: {
    fontSize: 20,
    fontFamily: font.semibold,
    fontWeight: '600',
    color: colors.ink,
  },
  error: {
    fontSize: 14,
    fontFamily: font.medium,
    fontWeight: '500',
    color: colors.danger,
    textAlign: 'center',
    paddingTop: 22,
    paddingHorizontal: 40,
  },
  legal: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.tertiaryText,
    textAlign: 'center',
    lineHeight: 17,
    paddingTop: 22,
    paddingHorizontal: 44,
  },
  legalLink: {
    color: colors.secondaryText,
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 24,
  },
});
