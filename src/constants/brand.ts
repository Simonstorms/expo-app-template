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

function money(amount: number, decimals = 2): string {
  const value = amount.toFixed(decimals).replace('.', currency.decimalSeparator);
  return currency.position === 'prefix'
    ? `${currency.symbol}${value}`
    : `${value} ${currency.symbol}`;
}

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
    yearly: money(49.99),
    yearlyPerMonth: money(4.16),
    monthly: money(9.99),
    offerYearly: money(29.99),
    offerPerMonth: money(2.49),
  },

  legal: {
    privacyUrl: 'https://example.com/privacy',
    termsUrl: 'https://example.com/terms',
    supportEmail: 'support@example.com',
    appStoreUrl: '' as string,
  },
} as const;

export function formatMoney(amount: number, decimals = 2): string {
  return money(amount, decimals);
}
