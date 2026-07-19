import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { hasSupabase } from '@/constants/config';
import { signInAsGuest, signInWithApple, signInWithGoogle } from '../api';
import { GlassGroup, GlassSurface } from '@/components/ui/glass';
import { Icon } from '@/components/ui/icon';
import { OnboardingScaffold } from '@/features/onboarding/components/onboarding-scaffold';
import { TitleBlock } from '@/components/ui/title-block';
import { colors, withAlpha } from '@/constants/theme';
import { useFlow } from '@/features/onboarding/hooks/use-flow';

export default function SignInScreen() {
  const { advance } = useFlow('sign-in');
  const busy = useRef(false);

  useFocusEffect(
    useCallback(() => {
      busy.current = false;
    }, []),
  );

  const onApple = async () => {
    if (busy.current) return;
    busy.current = true;
    if (hasSupabase) {
      try {
        await signInWithApple();
      } catch {
        busy.current = false;
        return;
      }
    }
    advance();
  };

  const onGoogle = async () => {
    if (busy.current) return;
    busy.current = true;
    if (hasSupabase) {
      try {
        await signInWithGoogle();
      } catch {
        busy.current = false;
        return;
      }
    }
    advance();
  };

  const onSkip = async () => {
    if (busy.current) return;
    busy.current = true;
    if (hasSupabase) {
      await signInAsGuest().catch(() => undefined);
    }
    advance();
  };

  return (
    <OnboardingScaffold step="sign-in" ctaTitle={null}>
      <View style={styles.container}>
        <TitleBlock title="Save your progress" />
        <View style={styles.topSpacer} />
        <GlassGroup spacing={23} style={styles.buttons}>
          {Platform.OS === 'ios' ? <AppleButton onPress={onApple} /> : null}
          <GoogleButton onPress={onGoogle} />
        </GlassGroup>
        <SkipFooter onPress={onSkip} />
        <View style={styles.bottomSpacer} />
      </View>
    </OnboardingScaffold>
  );
}

function AppleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <GlassSurface radius={31} tintColor={colors.ink} isInteractive style={styles.button}>
        <Icon name="applelogo" size={26} color={colors.white} />
        <Text style={styles.appleLabel}>Sign in with Apple</Text>
      </GlassSurface>
    </Pressable>
  );
}

function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <GlassSurface
        radius={31}
        tintColor={withAlpha(colors.white, 0.92)}
        isInteractive
        style={[styles.button, styles.googleBorder]}>
        <GoogleGGlyph />
        <Text style={styles.googleLabel}>Sign in with Google</Text>
      </GlassSurface>
    </Pressable>
  );
}

function GoogleGGlyph() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Defs>
        <LinearGradient id="googleG" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#4186F3" />
          <Stop offset="0.28" stopColor="#4186F3" />
          <Stop offset="0.3" stopColor="#34A954" />
          <Stop offset="0.5" stopColor="#34A954" />
          <Stop offset="0.52" stopColor="#FCBC05" />
          <Stop offset="0.72" stopColor="#FCBC05" />
          <Stop offset="0.74" stopColor="#E94232" />
          <Stop offset="1" stopColor="#E94232" />
        </LinearGradient>
      </Defs>
      <SvgText
        x={15}
        y={23}
        fontSize={27}
        fontWeight="bold"
        fill="url(#googleG)"
        textAnchor="middle">
        G
      </SvgText>
    </Svg>
  );
}

function SkipFooter({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.footer}>
      <Text style={styles.footerText}>Would you like to sign in later?</Text>
      <Text style={styles.footerSkip}>Skip</Text>
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
    maxHeight: 209,
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
  appleLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  googleBorder: {
    borderRadius: 31,
    borderWidth: 1.7,
    borderColor: colors.ink,
  },
  googleLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 44,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.ink,
  },
  footerSkip: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 24,
  },
});
