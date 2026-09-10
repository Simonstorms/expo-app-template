import type { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { hasSupabase } from '@/constants/config';
import { supabase } from '@/lib/supabase';

const SESSION_KEY = ['auth', 'session'];

async function fetchSession(): Promise<Session | null> {
  if (!hasSupabase) {
    return null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}

function subscribeToAuthChanges(queryClient: QueryClient): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    queryClient.setQueryData(SESSION_KEY, session);
  });
  return () => {
    data.subscription.unsubscribe();
  };
}

export function useSession() {
  const queryClient = useQueryClient();

  useEffect(() => (hasSupabase ? subscribeToAuthChanges(queryClient) : undefined), [queryClient]);

  const query = useQuery({
    queryKey: SESSION_KEY,
    queryFn: fetchSession,
    gcTime: Infinity,
    initialData: hasSupabase ? undefined : null,
  });

  return {
    session: query.data ?? null,
    user: query.data?.user ?? null,
    isSignedIn: Boolean(query.data),
    isLoading: query.isLoading,
  };
}
