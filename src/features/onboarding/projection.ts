const QUIT_HORIZON_DAYS = 90;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 4.345;
const MIN_DAILY_LIMIT = 1;

export type ProjectionInput = {
  perDay: number;
  reducePerWeek: number;
  weeklySpend: number;
};

export type Projection = {
  horizonDays: number;
  dailyLimit: number;
  dailySpend: number;
  weeksToZero: number;
  savedPerDay: number;
  savedPerMonth: number;
  savedOverHorizon: number;
};

function positive(value: number, fallback = 0): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function projectPlan({ perDay, reducePerWeek, weeklySpend }: ProjectionInput): Projection {
  const safePerDay = Math.max(0, positive(perDay));
  const safeReduce = Math.max(0, positive(reducePerWeek));
  const safeSpend = Math.max(0, positive(weeklySpend));

  const dailyLimit = Math.max(MIN_DAILY_LIMIT, safePerDay - Math.trunc(safeReduce));
  const dailySpend = safeSpend / DAYS_PER_WEEK;
  const weeksToZero = safeReduce > 0 ? Math.ceil(safePerDay / safeReduce) : Infinity;
  const savedPerDay = safePerDay > 0 ? dailySpend * ((safePerDay - dailyLimit) / safePerDay) : 0;

  return {
    horizonDays: QUIT_HORIZON_DAYS,
    dailyLimit,
    dailySpend,
    weeksToZero,
    savedPerDay,
    savedPerMonth: savedPerDay * DAYS_PER_WEEK * WEEKS_PER_MONTH,
    savedOverHorizon: savedPerDay * QUIT_HORIZON_DAYS,
  };
}
