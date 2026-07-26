import * as Notifications from 'expo-notifications';
import { type Href, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { captureEvent } from '@/lib/analytics';

export function useNotificationIntent(): void {
  const router = useRouter();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    const url = response?.notification.request.content.data?.url;
    if (typeof url !== 'string' || !url.startsWith('/')) return;
    captureEvent('notification_opened', { url });
    router.navigate(url as Href);
  }, [response, router]);
}
