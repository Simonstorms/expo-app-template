import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassSurface } from '@/components/ui/glass';
import { OnboardingScaffold } from '../components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { useOnboarding } from '../store';
import { colors, layout, withAlpha } from '@/constants/theme';
import { content } from '@/constants/content';
import { useFlow } from '../hooks/use-flow';

export default function ReferralCodeScreen() {
  const referralCode = useOnboarding((state) => state.referralCode);
  const set = useOnboarding((state) => state.set);
  const inputRef = useRef<TextInput>(null);
  const flow = useFlow('referral');

  return (
    <OnboardingScaffold flow={flow} ctaTitle={content.common.continue}>
      <View style={styles.container}>
        <TitleBlock title={content.referral.title} subtitle={content.referral.subtitle} />
        <View style={styles.spacer} />
        <View style={styles.fieldWrap}>
          <GlassSurface radius={10} tintColor={withAlpha(colors.cardFill, 0.85)} style={styles.card}>
            <TextInput
              ref={inputRef}
              value={referralCode}
              onChangeText={(value) => set('referralCode', value)}
              placeholder={content.referral.placeholder}
              placeholderTextColor="#A2A1A6"
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => inputRef.current?.blur()}
              style={styles.input}
            />
            <Pressable onPress={() => inputRef.current?.blur()}>
              <GlassSurface
                radius={19}
                tintColor={referralCode.length === 0 ? '#C0BFC6' : colors.ctaFill}
                fallbackColor={referralCode.length === 0 ? '#C0BFC6' : colors.ctaFill}
                isInteractive
                style={styles.submitButton}>
                <Text style={styles.submitLabel}>{content.referral.submit}</Text>
              </GlassSurface>
            </Pressable>
          </GlassSurface>
        </View>
        <View style={styles.spacer} />
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
  fieldWrap: {
    paddingHorizontal: layout.margin,
    paddingBottom: 90,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 15,
    height: 62,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
    padding: 0,
  },
  submitButton: {
    width: 87,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});
