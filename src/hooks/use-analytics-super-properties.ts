import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { config } from '@/constants/config';
import { useEntitlement } from '@/features/paywall/hooks/use-entitlement';
import { registerSuperProperties, setPersonProperties } from '@/lib/analytics';
import { getOnboardingComplete } from '@/lib/storage';

const ONBOARDING_COMPLETE_KEY = ['onboarding', 'complete'];

export function useAnalyticsSuperProperties(): void {
  const { isPro, isLoading } = useEntitlement();
  const onboarding = useQuery({
    queryKey: ONBOARDING_COMPLETE_KEY,
    queryFn: getOnboardingComplete,
  });
  const onboardingCompleted = onboarding.data ?? false;

  useEffect(() => {
    registerSuperProperties({ env: config.env });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    registerSuperProperties({ is_pro: isPro });
    setPersonProperties({ is_pro: isPro });
  }, [isPro, isLoading]);

  useEffect(() => {
    if (onboarding.isLoading) return;
    registerSuperProperties({ onboarding_completed: onboardingCompleted });
  }, [onboardingCompleted, onboarding.isLoading]);
}
