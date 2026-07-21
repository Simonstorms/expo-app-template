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

  legal: {
    privacyUrl: 'https://example.com/privacy',
    termsUrl: 'https://example.com/terms',
    appStoreUrl: 'https://apps.apple.com/app/id0000000000?action=write-review',
  },
} as const;

export function formatMoney(amount: number, decimals = 2): string {
  const value = amount.toFixed(decimals).replace('.', brand.currency.decimalSeparator);
  return brand.currency.position === 'prefix'
    ? `${brand.currency.symbol}${value}`
    : `${value} ${brand.currency.symbol}`;
}
