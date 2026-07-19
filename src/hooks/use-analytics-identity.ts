import { useEffect } from 'react';

import { useSession } from '@/features/auth/hooks/use-session';
import { identifyUser, resetUser } from '@/lib/analytics';

export function useAnalyticsIdentity(): void {
  const { user } = useSession();

  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id, user.email ? { email: user.email } : undefined);
    } else {
      resetUser();
    }
  }, [user?.id, user?.email]);
}
