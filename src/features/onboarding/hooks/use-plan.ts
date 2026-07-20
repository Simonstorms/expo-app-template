import { formatMoney } from '@/constants/brand';
import { content } from '@/constants/content';

import { useOnboarding } from '../store';

const QUIT_HORIZON_DAYS = 90;

function quitDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + QUIT_HORIZON_DAYS);
  return date;
}

function dailySpend(weeklySpend: number): number {
  return weeklySpend / 7;
}

type Plan = {
  quitDate: Date;
  goalDate: string;
  dailyLimit: string;
  moneySaved: string;
};

export function usePlan(): Plan {
  const pouchesPerDay = useOnboarding((state) => state.pouchesPerDay);
  const reducePerWeek = useOnboarding((state) => state.reducePerWeek);
  const weeklySpend = useOnboarding((state) => state.weeklySpend);

  const date = quitDate();
  const goalDate = `${content.birthdate.monthNames[date.getMonth()]} ${date.getDate()}`;
  const dailyLimit = `${Math.max(1, pouchesPerDay - Math.trunc(reducePerWeek))}`;
  const moneySaved = formatMoney(dailySpend(weeklySpend));

  return { quitDate: date, goalDate, dailyLimit, moneySaved };
}
