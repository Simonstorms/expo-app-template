import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { hasSupabase } from '@/constants/config';
import { completeSessionFromUrl } from '@/features/auth/api';

export function useAuthDeepLink(): void {
  const url = Linking.useURL();

  useEffect(() => {
    if (!hasSupabase || !url) return;
    void completeSessionFromUrl(url).catch(() => undefined);
  }, [url]);
}
