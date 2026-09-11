import type { IconName } from '@/components/ui/icon';
import type {
  DiscoverySource,
  Gender,
  Obstacle,
  QuitGoal,
  UsageLevel,
} from '@/features/onboarding/types';

import { brand, formatMoney } from './brand';

const cap = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const calibrationSubtitle = 'This will be used to calibrate your\ncustom plan.';

export const content = {
  common: {
    continue: 'Continue',
  },

  welcome: {
    tagline: brand.tagline,
    getStarted: 'Get Started',
    signInPrompt: 'Already have an account? ',
    signInAction: 'Sign In',
    mock: {
      wordmark: brand.wordmark,
      streakLabel: 'YOUR STREAK',
      streakValue: '12',
      streakCaption: `days ${brand.freeLabel}`,
      savedValue: formatMoney(48),
      savedCaption: 'saved',
      avoidedValue: '84',
      avoidedCaption: `${brand.unitPlural} avoided`,
      milestoneTitle: 'Next milestone',
      milestoneSub: '2 weeks · tomorrow',
    },
  },

  gender: {
    title: 'Choose your Gender',
    subtitle: calibrationSubtitle,
    options: [
      { id: 'male', label: 'Male' },
      { id: 'female', label: 'Female' },
      { id: 'other', label: 'Other' },
    ] satisfies { id: Gender; label: string }[],
  },

  usage: {
    title: `How many ${brand.unitPlural}\ndo you use per day?`,
    subtitle: calibrationSubtitle,
    options: [
      { id: 'light', label: '1-5', caption: 'Now and then', dots: 1 },
      { id: 'regular', label: '6-10', caption: 'Regular part of my day', dots: 3 },
      { id: 'heavy', label: '11+', caption: 'Heavy daily use', dots: 6 },
    ] satisfies { id: UsageLevel; label: string; caption: string; dots: number }[],
  },

  source: {
    title: 'Where did you hear about us?',
    options: [
      { id: 'instagram', label: 'Instagram' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'tv', label: 'TV' },
      { id: 'friends', label: 'Friend or family' },
      { id: 'facebook', label: 'Facebook' },
      { id: 'youtube', label: 'Youtube' },
      { id: 'google', label: 'Google' },
    ] satisfies { id: DiscoverySource; label: string }[],
  },

  triedBefore: {
    title: `Have you tried quitting ${brand.substance} before?`,
    no: 'No',
    yes: 'Yes',
  },

  resultsGraph: {
    title: `${brand.appName} creates long-term results`,
    cardTitle: `Your ${brand.substanceScientific} intake`,
    brandText: brand.wordmark,
    pillLabel: cap(brand.substanceScientific),
    curveLabel: 'Cold turkey',
    axisStart: 'Month 1',
    axisEnd: 'Month 6',
    footnote: `80% of ${brand.appName} users stay ${brand.freeLabel} even 6 months later`,
  },

  habits: {
    title: `Your ${brand.substance} habits`,
    subtitle: 'This will be used to calibrate your custom plan.',
    typePouches: cap(brand.unitPlural),
    typeLoose: 'Loose',
    headerYears: 'Years of use',
    headerPerDay: 'Per day',
    yearSingular: 'year',
    yearPlural: 'years',
  },

  birthdate: {
    title: 'When were you born?',
    subtitle: calibrationSubtitle,
    columnMonth: 'Month',
    columnDay: 'Day',
    columnYear: 'Year',
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },

  goal: {
    title: 'What is your goal?',
    subtitle: 'This helps us generate your personalized quit plan.',
    options: [
      { id: 'quitCompletely', label: 'Quit completely' },
      { id: 'cutBack', label: 'Cut back gradually' },
      { id: 'stayFree', label: `Stay ${brand.substanceScientific}-free` },
    ] satisfies { id: QuitGoal; label: string }[],
  },

  weeklySpend: {
    title: `How much do you spend on ${brand.substance} per week?`,
    label: 'Weekly spend',
  },

  realisticTarget: {
    headline: 'Quitting in 90 days is a realistic target. It’s not hard at all!',
    headlineHighlight: '90 days',
    caption: `90% of users say cravings fade noticeably after the first week with ${brand.appName}.`,
  },

  pace: {
    title: 'How fast do you want to quit?',
    sectionLabel: `Reduce ${brand.unitPlural} per week`,
    recommended: 'Recommended',
  },

  comparison: {
    title: `Quit twice as fast with ${brand.appName} vs on your own`,
    columnLeft: `Without\n${brand.appName}`,
    columnRight: `With\n${brand.appName}`,
    badgeLabel: '20%',
    barLabel: '2X',
    captionDark: `${brand.appName} makes it easy and holds`,
    captionLight: 'you accountable.',
  },

  obstacles: {
    title: 'What’s stopping you from quitting?',
    options: [
      { id: 'consistency', label: 'Lack of consistency', symbol: 'chart.bar.fill' },
      { id: 'cravings', label: 'Stress and cravings', symbol: 'bolt.fill' },
      { id: 'support', label: 'Lack of support', symbol: 'medal.fill' },
      { id: 'schedule', label: 'Busy schedule', symbol: 'calendar' },
      { id: 'socialPressure', label: 'Social pressure', symbol: 'person.2.fill' },
    ] satisfies { id: Obstacle; label: string; symbol: IconName }[],
  },

  potentialGraph: {
    title: 'You have great potential to crush your goal',
    cardTitle: 'Your freedom progress',
    axisLabels: ['3 Days', '7 Days', '30 Days'],
    footnote: `Based on ${brand.appName} historical data, the first days feel slow, but after 7 days you speed toward your goal quickly!`,
  },

  trustPrivacy: {
    title: 'Thank you for\ntrusting us',
    subtitle: `Now let’s personalize ${brand.appName} for you…`,
    cardTitle: 'Your privacy and security matter to us.',
    cardCaption: 'We promise to always keep your\npersonal information private and secure.',
  },

  appleHealth: {
    title: 'Connect to\nApple Health',
    subtitle: `Sync your daily activity between ${brand.appName} and the Health app to have the most thorough data.`,
    labelWalking: 'Walking',
    labelRunning: 'Running',
    labelHeartRate: 'Heart Rate',
    labelSleep: 'Sleep',
    skip: 'Not now',
  },

  savingsPreview: {
    title: 'See the money you save every day?',
    savedLabel: 'Saved so far',
    amount: formatMoney(45),
    icon: brand.currency.icon,
    todayLabel: 'Today',
    todayValue: `+${formatMoney(4.5)}`,
  },

  rollover: {
    title: `Roll over unused ${brand.unitPlural} to the next day?`,
    pillPrefix: 'Roll over up to ',
    pillHighlight: `2 ${brand.unitPlural}`,
    dayYesterday: 'Yesterday',
    dayToday: 'Today',
    badgeLabel: 'Left',
  },

  rating: {
    title: 'Give us a rating',
    laurelScore: '4.8',
    laurelCaption: '1K+ App Ratings',
    madeFor: `${brand.appName} was made for\npeople like you`,
    usersCount: `10K+ ${brand.appName} Users`,
    testimonialName: 'Jonas K.',
    testimonialQuote: `Two weeks in and I barely think about ${brand.substance} anymore. The daily plan kept me honest the whole way.`,
  },

  notifications: {
    title: 'Reach your goals with\nnotifications',
    caption: 'Only the updates you pick. No spam, no daily noise.',
    previews: {
      first: {
        title: 'You’re all set',
        body: `Your ${brand.appName} plan is ready whenever you are.`,
        time: 'now',
      },
      second: {
        title: 'Your trial ends soon',
        body: 'Cancel in two taps if it’s not for you.',
        time: '9:41',
      },
      third: {
        title: 'Your week in review',
        body: 'You hit 5 of 7 goals this week. Nice work.',
        time: 'Mon',
      },
    },
    dismiss: 'Don’t Allow',
    allow: 'Allow',
  },

  trialReminder: {
    notificationTitle: `Your ${brand.appName} trial ends soon`,
    notificationBody: 'Keep your access, or cancel in two taps.',
  },

  referral: {
    title: 'Enter referral code (optional)',
    subtitle: 'You can skip this step',
    placeholder: 'Referral Code',
    submit: 'Submit',
  },

  allDone: {
    doneLabel: 'All done!',
    title: 'Time to generate\nyour custom plan!',
  },

  generating: {
    headline: 'We’re setting\neverything up for you',
    caption: `Customizing your quit plan...`,
    cardTitle: 'Daily recommendation for',
    bullets: ['Daily limit', 'Craving support', 'Money saved', 'Health score'],
  },

  planReady: {
    headline: 'Congratulations\nyour custom plan is ready!',
    subhead: `You should be ${brand.freeLabel} by:`,
    goalPrefix: `${cap(brand.freeLabel)} by`,
    cardTitle: 'Daily recommendation',
    cardSubtitle: 'You can edit this anytime',
    metricDailyLimitLabel: 'Daily limit',
    metricDailyLimitUnit: brand.unitPlural,
    metricMoneySavedLabel: 'Money saved',
    metricCravingLabel: 'Craving level',
    metricCravingValue: 'Low',
    metricHealthLabel: 'Health score',
    metricHealthValue: '7/10',
    cta: 'Let’s get started!',
  },

  signIn: {
    title: 'Save your progress',
    subtitle: 'Sign in to sync your plan across your devices.',
    google: 'Sign in with Google',
    error: 'Something went wrong. Please try again.',
    legalPrefix: 'By continuing you agree to our',
    legalTerms: 'Terms',
    legalAnd: 'and',
    legalPrivacy: 'Privacy Policy',
  },

  paywall: {
    noPayment: 'No Payment Due Now',
    cta: 'Continue',
    ctaTrial: `Start My ${brand.trial.days}-Day Free Trial`,
    priceLoading: 'Loading pricing…',
    priceError: 'We couldn’t load pricing. Check your connection.',
    priceRetry: 'Try again',
    restore: 'Restore',
    headline: `Unlock ${brand.appName} to reach your goals faster.`,
    timeline: [
      {
        icon: 'lock.open.fill',
        title: 'Today: Full access',
        body: `Everything in ${brand.proName} unlocks right away. Nothing due today.`,
      },
      {
        icon: 'bell.badge.fill',
        title: `Day ${brand.trial.days - 2}: Reminder`,
        body: 'We remind you before your trial ends.',
      },
      {
        icon: 'star.fill',
        title: `Day ${brand.trial.days}: Trial ends`,
        body: 'Your subscription starts. Cancel anytime before.',
      },
    ],
    planYearly: 'Yearly',
    planMonthly: 'Monthly',
    perYear: '/year',
    perMonth: '/month',
    perMonthShort: '/mo',
    savingsBadge: (percent: number) => `SAVE ${percent}%`,
    trialTerms: (price: string, period: 'year' | 'month') =>
      `${brand.trial.days}-day free trial, then ${price}/${period}. Auto-renews, cancel anytime in Settings.`,
    billedTerms: (price: string, period: 'year' | 'month') =>
      `${price}/${period}. Auto-renews, cancel anytime in Settings.`,
    restoreNoneTitle: 'Nothing to restore',
    restoreNoneBody: 'We could not find a previous purchase for this account.',
    restoreErrorTitle: 'Restore failed',
    restoreErrorBody: 'Something went wrong. Please try again.',
    purchaseErrorTitle: 'Purchase failed',
    purchaseErrorBody: 'Something went wrong. Please try again.',
    termsLabel: 'Terms of Service',
    privacyLabel: 'Privacy Policy',
    deleteAccount: 'Delete account',
    offer: {
      title: 'One last offer,\nthen we’ll stop asking',
      discountBadge: (percent: number) => `${percent}% OFF`,
      note: `This is the lowest price we can put on a full year of ${brand.proName}, and it is yours if you want it.`,
      signature: `The ${brand.appName} team`,
      wasPrice: (price: string) => `was ${price}`,
      cta: 'Continue',
      ctaTrial: 'Start Free Trial',
      noCommitment: 'No commitment · Cancel anytime',
    },
    decline: {
      title: 'What’s holding\nyou back?',
      subtitle: 'One tap, and it helps us more than you think.',
      price: 'It’s too expensive',
      unsure: 'Not sure it’s for me',
      browsing: 'Just looking around',
      reassureTitle: 'It’s free to try',
      later: 'Maybe later',
    },
    mock: {
      wordmark: brand.wordmark,
      daysValue: '12',
      daysLabel: `Days ${brand.freeLabel}`,
      unitsValue: '4',
      unitsLabel: `${cap(brand.unitPlural)} left`,
      savedValue: formatMoney(45),
      savedLabel: 'Saved',
      healthValue: '92%',
      healthLabel: 'Health',
      recent: 'Recent check-ins',
      checkinTitle: 'Craving resisted at work',
      checkinTime: '14:10',
      checkinStat: '3 cravings resisted',
    },
  },

  home: {
    tabTitle: 'Home',
    wordmark: brand.wordmark,
    heroValue: '12',
    heroLabel: `Days ${brand.freeLabel}`,
    heroSub: 'You are building a strong streak.',
    statAvoidedLabel: 'Avoided',
    statAvoidedValue: '84',
    statSavedLabel: 'Saved',
    statSavedValue: formatMoney(45),
    statHealthLabel: 'Health',
    statHealthValue: '92%',
    sectionTitle: 'Recent check-ins',
    checkinCravingTitle: 'Craving resisted at work',
    checkinCravingTime: '14:10',
    checkinCravingDetail: '3 cravings resisted',
    checkinWalkTitle: `Walked instead of a ${brand.unit}`,
    checkinWalkTime: '08:32',
    checkinWalkDetail: '20 min of activity',
    cta: 'Log a check-in',
  },

  settings: {
    title: 'Settings',
    version: `${brand.appName} · v${brand.version}`,
    sectionAccount: 'Account',
    sectionSubscription: 'Subscription',
    sectionPreferences: 'Preferences',
    sectionAbout: 'About',
    accountSignedIn: 'Signed in',
    accountGuest: 'Guest',
    subPro: brand.proName,
    subActive: 'Active',
    subFree: 'Free',
    subRestore: 'Restore purchases',
    subManage: 'Manage subscription',
    prefNotifications: 'Notifications',
    prefReminders: 'Reminders',
    prefAnalytics: 'Share usage analytics',
    aboutPrivacy: 'Privacy Policy',
    aboutTerms: 'Terms of Service',
    aboutSupport: 'Contact support',
    aboutRate: `Rate ${brand.appName}`,
    signOut: 'Sign out',
    deleteAccount: 'Delete account',
    deleteConfirmTitle: 'Delete account?',
    deleteConfirmBody:
      'This permanently deletes your account and all of your data. This cannot be undone.',
    deleteConfirmCancel: 'Cancel',
    deleteConfirmAction: 'Delete',
    deleteErrorTitle: 'Could not delete account',
    deleteErrorBody: 'Something went wrong. Please try again.',
  },

  errorBoundary: {
    title: 'Something went wrong',
    body: 'The app hit an unexpected error. Try again, and if it keeps happening, restart the app.',
    retry: 'Try again',
  },
} as const;
