import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useEffect } from 'react';

import { captureEvent } from '@/lib/analytics';

type AppHref = Extract<Href, string>;

function isAppHref(value: unknown): value is AppHref {
  return typeof value === 'string' && value.startsWith('/');
}

export function useNotificationIntent(): void {
  const router = useRouter();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const url = response?.notification.request.content.data?.url;
    if (!isAppHref(url)) {
      return;
    }
    captureEvent('notification_opened', { url });
    router.navigate(url);
  }, [response, router]);
}
