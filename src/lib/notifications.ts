import * as Notifications from 'expo-notifications';

import { brand } from '@/constants/brand';
import { content } from '@/constants/content';
import { captureEvent } from '@/lib/analytics';

const TRIAL_REMINDER_ID = 'trial-reminder';
const REMINDER_HOUR = 9;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleTrialReminder(daysBeforeEnd: number): Promise<boolean> {
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) return false;

  const daysFromNow = brand.trial.days - daysBeforeEnd;
  if (daysFromNow <= 0) return false;

  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  date.setHours(REMINDER_HOUR, 0, 0, 0);

  await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID).catch(() => undefined);
  await Notifications.scheduleNotificationAsync({
    identifier: TRIAL_REMINDER_ID,
    content: {
      title: content.trialReminder.notificationTitle,
      body: content.trialReminder.notificationBody,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
  captureEvent('trial_reminder_scheduled', {
    days_before_end: daysBeforeEnd,
    days_from_now: daysFromNow,
  });
  return true;
}

export async function cancelTrialReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID).catch(() => undefined);
}
