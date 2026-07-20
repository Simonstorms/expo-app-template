import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { config, hasSupabase } from '@/constants/config';
import { secureStorage } from '@/lib/secure-storage';
import type { Database } from '@/types/database';

const url = config.supabaseUrl || 'http://localhost:54321';
const anonKey = config.supabaseAnonKey || 'anon-key-not-configured';
const isServer = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    storage: secureStorage,
    flowType: 'pkce',
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});

if (hasSupabase && !isServer) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
