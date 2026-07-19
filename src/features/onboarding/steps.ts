export const STEPS = [
  'index',
  'welcome',
  'gender',
  'usage',
  'source',
  'tried-before',
  'results-graph',
  'habits',
  'birthdate',
  'goal',
  'weekly-spend',
  'realistic-target',
  'pace',
  'comparison',
  'obstacles',
  'potential-graph',
  'trust-privacy',
  'apple-health',
  'savings-preview',
  'rollover',
  'rating',
  'notifications',
  'referral',
  'all-done',
  'generating',
  'plan-ready',
  'sign-in',
  'paywall',
] as const;

export type Step = (typeof STEPS)[number];

const CHROME_HIDDEN = new Set<Step>(['index', 'welcome', 'generating', 'plan-ready', 'paywall']);

const PROGRESS_STEPS = STEPS.filter((step) => !CHROME_HIDDEN.has(step));

export function showsChrome(step: Step): boolean {
  return !CHROME_HIDDEN.has(step);
}

export function progressFor(step: Step): number {
  const index = PROGRESS_STEPS.indexOf(step);
  if (index < 0) return 0;
  return (index + 1) / PROGRESS_STEPS.length;
}

export function routePath(step: Step): string {
  return step === 'index' ? '/' : `/${step}`;
}

export function nextStep(step: Step): Step | undefined {
  const index = STEPS.indexOf(step);
  if (index < 0 || index + 1 >= STEPS.length) return undefined;
  return STEPS[index + 1];
}
