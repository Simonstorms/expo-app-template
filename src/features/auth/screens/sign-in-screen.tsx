import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthCancelledError, signInWithApple, signInWithGoogle } from '../api';
import { EmailSignIn } from '../components/email-sign-in';
import { GoogleLogo } from '@/components/ui/brand-logos';
import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { content } from '@/constants/content';
import { colors, withAlpha } from '@/constants/theme';
import { captureEvent } from '@/lib/analytics';
import { useFlow } from '@/features/onboarding/hooks/use-flow';

type Mode = 'options' | 'email';

export default function SignInScreen() {
  const flow = useFlow('sign-in');
  const { advance } = flow;
  const [mode, setMode] = useState<Mode>('options');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runProvider = async (signIn: () => Promise<void>, provider: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signIn();
      advance();
    } catch (err) {
      if (err instanceof AuthCancelledError) return;
      setError(content.signIn.error);
      captureEvent('sign_in_failed', { provider });
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'email') {
    return (
      <OnboardingScaffold flow={{ ...flow, showsChrome: false }} ctaTitle={null}>
        <EmailSignIn onSuccess={advance} onBack={() => setMode('options')} />
      </OnboardingScaffold>
    );
  }

  return (
    <OnboardingScaffold flow={flow} ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title={content.signIn.title} subtitle={content.signIn.subtitle} />
        <View style={styles.topSpacer} />
        <GlassGroup spacing={16} style={styles.buttons}>
          {Platform.OS === 'ios' ? (
            <AppleButton disabled={busy} onPress={() => runProvider(signInWithApple, 'apple')} />
          ) : null}
          <GoogleButton disabled={busy} onPress={() => runProvider(signInWithGoogle, 'google')} />
          <EmailButton
            disabled={busy}
            onPress={() => {
              setError(null);
              setMode('email');
            }}
          />
        </GlassGroup>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

type ButtonProps = { onPress: () => void; disabled?: boolean };

function AppleButton({ onPress, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={disabled ? styles.dimmed : undefined}>
      <GlassSurface radius={31} tintColor={colors.ink} isInteractive style={styles.button}>
        <Icon name="applelogo" size={26} color={colors.white} />
        <Text style={styles.appleLabel}>{content.signIn.apple}</Text>
      </GlassSurface>
    </Pressable>
  );
}

function GoogleButton({ onPress, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={disabled ? styles.dimmed : undefined}>
      <GlassSurface
        radius={31}
        tintColor={withAlpha(colors.white, 0.92)}
        isInteractive
        style={[styles.button, styles.outlined]}>
        <GoogleLogo size={24} />
        <Text style={styles.darkLabel}>{content.signIn.google}</Text>
      </GlassSurface>
    </Pressable>
  );
}

function EmailButton({ onPress, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={disabled ? styles.dimmed : undefined}>
      <GlassSurface
        radius={31}
        tintColor={withAlpha(colors.white, 0.92)}
        isInteractive
        style={[styles.button, styles.outlined]}>
        <Icon name="envelope.fill" size={22} color={colors.ink} />
        <Text style={styles.darkLabel}>{content.signIn.email}</Text>
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
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 21,
  },
  dimmed: {
    opacity: 0.55,
  },
  appleLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  outlined: {
    borderRadius: 31,
    borderWidth: 1.7,
    borderColor: colors.ink,
  },
  darkLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.orange,
    textAlign: 'center',
    paddingTop: 22,
    paddingHorizontal: 40,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 24,
  },
});
