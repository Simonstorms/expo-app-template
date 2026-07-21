import type { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { hasSupabase } from '@/constants/config';
import { setOnboardingComplete } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export class AuthCancelledError extends Error {
  constructor() {
    super('Sign-in was cancelled.');
    this.name = 'AuthCancelledError';
  }
}

function isAppleCancellation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ERR_REQUEST_CANCELED'
  );
}

async function requestAppleCredential(hashedNonce: string) {
  try {
    return await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (error) {
    if (isAppleCancellation(error)) throw new AuthCancelledError();
    throw error;
  }
}

export async function signInWithApple(): Promise<void> {
  if (!hasSupabase) return;
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );
  const credential = await requestAppleCredential(hashedNonce);
  if (!credential.identityToken) {
    throw new Error('Apple sign-in did not return an identity token.');
  }
  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;
}

export async function completeSessionFromUrl(url: string): Promise<Session | null> {
  const { queryParams } = Linking.parse(url);
  const code = typeof queryParams?.code === 'string' ? queryParams.code : null;
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return data.session;
  }
  const accessToken =
    typeof queryParams?.access_token === 'string' ? queryParams.access_token : null;
  const refreshToken =
    typeof queryParams?.refresh_token === 'string' ? queryParams.refresh_token : null;
  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    return data.session;
  }
  return null;
}

export async function signInWithGoogle(): Promise<void> {
  if (!hasSupabase) return;
  const redirectTo = Linking.createURL('/');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error('Google sign-in could not be started.');
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') {
    throw new AuthCancelledError();
  }
  const session = await completeSessionFromUrl(result.url).catch(() => null);
  if (session) return;
  const { data: existing } = await supabase.auth.getSession();
  if (!existing.session) {
    throw new Error('Google sign-in did not return a session.');
  }
}

export async function signOut(): Promise<void> {
  if (!hasSupabase) return;
  await supabase.auth.signOut();
}

export async function deleteAccount(): Promise<void> {
  if (!hasSupabase) return;
  const { error } = await supabase.rpc('delete_current_user');
  if (error) throw error;
  await supabase.auth.signOut({ scope: 'local' });
  await setOnboardingComplete(false).catch(() => undefined);
}
