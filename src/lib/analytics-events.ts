export type PaywallPlan = 'yearly' | 'monthly';

export type PermissionResult = 'granted' | 'denied' | 'skipped';

export type PurchaseOutcome = 'purchased' | 'cancelled' | 'failed';

export type AnalyticsEvents = {
  onboarding_step_completed: {
    step: string;
    step_index?: number;
    answer?: string | number | boolean;
  };
  onboarding_completed: { steps_total?: number };
  permission_requested: {
    permission: string;
    result: PermissionResult;
    context?: string;
  };
  sign_in_succeeded: { provider: string; context?: string };
  sign_in_failed: { provider: string; reason?: string };
  signed_out: undefined;
  account_deleted: undefined;
  paywall_viewed: { context?: string; placement?: string };
  paywall_offer_viewed: { context?: string };
  paywall_dismissed: { context?: string; view?: string };
  paywall_decline_reason_selected: { reason: string; context?: string };
  paywall_plan_selected: {
    plan: PaywallPlan;
    placement?: string;
    context?: string;
  };
  purchase_started: {
    placement?: string;
    plan?: PaywallPlan;
    product_id?: string;
    price?: number;
    currency?: string;
  };
  paywall_purchase_result: {
    outcome: PurchaseOutcome;
    placement?: string;
    plan?: PaywallPlan;
    product_id?: string;
    price?: number;
    currency?: string;
  };
  purchase_restore_result: { restored: boolean; error?: string };
  trial_reminder_scheduled: { days_before_end: number; days_from_now: number };
  notification_opened: { url: string };
  analytics_opt_out_toggled: { opted_out: boolean };
  app_error_boundary: { message: string };
  home_cta_pressed: undefined;
};

export type AnalyticsEventName = keyof AnalyticsEvents;
