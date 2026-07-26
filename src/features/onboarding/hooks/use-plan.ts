import { formatMoney } from '@/constants/brand';
import { content } from '@/constants/content';

import { projectPlan, type Projection } from '../projection';
import { useOnboarding } from '../store';

type Plan = {
  quitDate: Date;
  goalDate: string;
  dailyLimit: string;
  moneySaved: string;
  projection: Projection;
};

export function usePlan(): Plan {
  const pouchesPerDay = useOnboarding((state) => state.pouchesPerDay);
  const reducePerWeek = useOnboarding((state) => state.reducePerWeek);
  const weeklySpend = useOnboarding((state) => state.weeklySpend);

  const projection = projectPlan({
    perDay: pouchesPerDay,
    reducePerWeek,
    weeklySpend,
  });

  const quitDate = new Date();
  quitDate.setDate(quitDate.getDate() + projection.horizonDays);

  return {
    quitDate,
    goalDate: `${content.birthdate.monthNames[quitDate.getMonth()]} ${quitDate.getDate()}`,
    dailyLimit: `${projection.dailyLimit}`,
    moneySaved: formatMoney(projection.dailySpend),
    projection,
  };
}
