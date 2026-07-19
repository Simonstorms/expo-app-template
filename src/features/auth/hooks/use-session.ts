import type { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { hasSupabase } from '@/constants/config';
import { supabase } from '@/lib/supabase';

const SESSION_KEY = ['auth', 'session'];

async function fetchSession(): Promise<Session | null> {
  if (!hasSupabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function useSession() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hasSupabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(SESSION_KEY, session);
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  const query = useQuery({ queryKey: SESSION_KEY, queryFn: fetchSession });

  return {
    session: query.data ?? null,
    user: query.data?.user ?? null,
    isSignedIn: Boolean(query.data),
    isLoading: query.isLoading,
  };
}
