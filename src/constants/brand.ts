type Currency = {
  symbol: string;
  icon: string;
  position: 'prefix' | 'suffix';
  decimalSeparator: string;
};

const currency: Currency = {
  symbol: '€',
  icon: 'eurosign',
  position: 'suffix',
  decimalSeparator: ',',
};

export const brand = {
  appName: 'Expo App Template',
  wordmark: 'Expo App Template',
  version: '1.0.0',
  proName: 'Expo App Template Pro',
  tagline: 'Your app,\nready to ship',

  substance: 'snus',
  substanceScientific: 'nicotine',
  freeLabel: 'snus-free',
  unit: 'pouch',
  unitPlural: 'pouches',

  currency,

  trial: {
    days: 7,
  },

  pricing: {
    yearly: '$49.99',
    yearlyPerMonth: '$4.16',
    monthly: '$9.99',
    offerYearly: '$29.99',
    offerPerMonth: '$2.49',
  },

  legal: {
    privacyUrl: 'https://example.com/privacy',
    termsUrl: 'https://example.com/terms',
    supportEmail: 'support@example.com',
    appStoreUrl: '' as string,
  },
} as const;

export function formatMoney(amount: number, decimals = 2): string {
  const value = amount.toFixed(decimals).replace('.', brand.currency.decimalSeparator);
  return brand.currency.position === 'prefix'
    ? `${brand.currency.symbol}${value}`
    : `${value} ${brand.currency.symbol}`;
}
