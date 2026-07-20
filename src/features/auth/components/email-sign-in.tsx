import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { PrimaryCTA } from '@/components/ui/primary-cta';
import { TitleBlock } from '@/components/ui/title-block';
import { content } from '@/constants/content';
import { colors, layout, withAlpha } from '@/constants/theme';
import { signInWithEmail } from '../api';

type Step = 'email' | 'sent';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailSignIn({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendLink = async () => {
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
      setStep('sent');
    } catch {
      setError(content.signIn.error);
    } finally {
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
        title={isEmailStep ? content.signIn.emailTitle : content.signIn.sentTitle}
        subtitle={
          isEmailStep
            ? content.signIn.emailSubtitle
            : `${content.signIn.sentSubtitlePrefix}${email.trim()}${content.signIn.sentSubtitleSuffix}`
        }
      />

      <View style={styles.form}>
        {isEmailStep ? (
          <GlassSurface radius={16} tintColor={withAlpha(colors.white, 0.92)} style={styles.field}>
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
              onSubmitEditing={sendLink}
              returnKeyType="send"
            />
          </GlassSurface>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.cta}>
          {busy ? (
            <View style={styles.spinner}>
              <ActivityIndicator color={colors.ink} />
            </View>
          ) : isEmailStep ? (
            <PrimaryCTA title={content.signIn.sendLink} onPress={sendLink} />
          ) : (
            <Pressable onPress={sendLink} style={styles.resendRow} hitSlop={12}>
              <Text style={styles.resendText}>{content.signIn.resend}</Text>
            </Pressable>
          )}
        </View>
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
