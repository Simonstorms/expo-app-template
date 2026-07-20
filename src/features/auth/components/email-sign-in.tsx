import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { TitleBlock } from '@/components/ui/title-block';
import { content } from '@/constants/content';
import { colors, layout, withAlpha } from '@/constants/theme';
import { signInWithEmail, verifyEmailOtp } from '../api';

type Step = 'email' | 'code';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_LENGTH = 6;

export function EmailSignIn({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    if (busy) return;
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError(content.signIn.invalidEmail);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(trimmed);
      setCode('');
      setStep('code');
    } catch {
      setError(content.signIn.error);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (busy) return;
    const trimmed = code.trim();
    if (trimmed.length < CODE_LENGTH) {
      setError(content.signIn.invalidCode);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await verifyEmailOtp(email.trim(), trimmed);
      setBusy(false);
      onSuccess();
    } catch {
      setError(content.signIn.invalidCode);
      setBusy(false);
    }
  };

  const isEmailStep = step === 'email';

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setError(null);
          if (isEmailStep) {
            onBack();
          } else {
            setStep('email');
          }
        }}
        style={styles.backRow}
        hitSlop={12}>
        <Text style={styles.backText}>{content.signIn.back}</Text>
      </Pressable>

      <TitleBlock
        title={isEmailStep ? content.signIn.emailTitle : content.signIn.codeTitle}
        subtitle={
          isEmailStep
            ? content.signIn.emailSubtitle
            : `${content.signIn.codeSubtitlePrefix}${email.trim()}`
        }
      />

      <View style={styles.form}>
        <GlassSurface radius={16} tintColor={withAlpha(colors.white, 0.92)} style={styles.field}>
          {isEmailStep ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={content.signIn.emailPlaceholder}
              placeholderTextColor={colors.disabledFill}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              autoFocus
              style={styles.input}
              onSubmitEditing={sendCode}
              returnKeyType="send"
            />
          ) : (
            <TextInput
              value={code}
              onChangeText={(next) => setCode(next.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
              placeholder={content.signIn.codePlaceholder}
              placeholderTextColor={colors.disabledFill}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus
              style={[styles.input, styles.codeInput]}
              onSubmitEditing={verify}
              returnKeyType="done"
            />
          )}
        </GlassSurface>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.cta}>
          {busy ? (
            <View style={styles.spinner}>
              <ActivityIndicator color={colors.ink} />
            </View>
          ) : (
            <PrimaryCTA
              title={isEmailStep ? content.signIn.sendCode : content.signIn.verify}
              onPress={isEmailStep ? sendCode : verify}
            />
          )}
        </View>

        {isEmailStep ? null : (
          <Pressable onPress={sendCode} disabled={busy} style={styles.resendRow} hitSlop={12}>
            <Text style={styles.resendText}>{content.signIn.resend}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backRow: {
    paddingHorizontal: layout.margin,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  form: {
    paddingHorizontal: layout.margin,
    paddingTop: 28,
    gap: 16,
  },
  field: {
    height: 58,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardStroke,
    borderRadius: 16,
  },
  input: {
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: '500',
    color: colors.ink,
  },
  codeInput: {
    letterSpacing: 8,
    fontWeight: '700',
  },
  error: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.orange,
    paddingHorizontal: 4,
  },
  cta: {
    paddingTop: 8,
  },
  spinner: {
    height: layout.ctaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendRow: {
    alignItems: 'center',
    paddingTop: 6,
  },
  resendText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    textDecorationLine: 'underline',
  },
});
