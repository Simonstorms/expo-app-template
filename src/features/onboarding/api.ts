import { hasSupabase } from '@/constants/config';
import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/database';

export async function syncOnboarding(payload: Json): Promise<void> {
  if (!hasSupabase) return;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;

  const inserted = await supabase.from('onboarding_responses').insert({ user_id: userId, payload });
  if (inserted.error) throw inserted.error;

  const updated = await supabase
    .from('profiles')
    .update({ onboarding_complete: true, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (updated.error) throw updated.error;
}
