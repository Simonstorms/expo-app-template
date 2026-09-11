import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  ink: '#000000',
  inkSoft: '#4D4D4D',
  ctaFill: '#1E1A24',
  cardFill: '#F9F8FD',
  surfaceMuted: '#F2F2F2',
  slate: '#6F7C8B',
  secondaryText: '#706F72',
  tertiaryText: '#B0B5BC',
  disabledFill: '#BABABC',
  progressTrack: '#E8E8E8',
  hairline: '#E8E8E9',
  cardStroke: '#E9E9E9',
  ring: '#D6DAE0',
  accent: '#2E90FA',
  accentSoft: '#EAF2FE',
  success: '#33C15B',
  danger: '#E24C4C',
  orange: '#DE9B68',
  blue: '#6996DA',
  gradientPink: '#F2BCD4',
  gradientBlue: '#B6C6F5',
  dangerText: '#DC6868',
  shadowBlue: '#14284C',
  shadowInk: '#28282D',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export function withAlpha(hex: string, alpha: number): string {
  'worklet';
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const layout = {
  margin: 24,
  ctaMargin: 16,
  cardRadius: 16,
  rowRadius: 16,
  ctaHeight: 58,
  ctaRadius: 29,
  chipSize: 39,
} as const;

export const backgroundGradient = {
  colors: ['#FFFFFF', '#FFFFFF', '#F7F7F8'] as const,
  locations: [0, 0.6, 1] as const,
};

export const accentGradient = {
  colors: ['#EAF2FE', '#F8FBFF', '#FFFFFF'] as const,
  locations: [0, 0.55, 1] as const,
};

export const frostGradient = {
  colors: ['#F3F4F6', '#F3F4F6'] as const,
  locations: [0, 1] as const,
};

const systemFontFamily = 'System';

export const font = {
  regular: systemFontFamily,
  medium: systemFontFamily,
  semibold: systemFontFamily,
  bold: systemFontFamily,
  headline: systemFontFamily,
} as const;

export const text = {
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.ink,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.ink,
  },
  row: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.ink,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.ink,
  },
  cta: {
    fontSize: 17,
    fontWeight: '600',
  },
} satisfies Record<string, TextStyle>;

export const shadow = {
  card: {
    boxShadow: `0px 12px 44px ${withAlpha(colors.shadowBlue, 0.1)}`,
  },
  soft: {
    boxShadow: `0px 6px 24px ${withAlpha(colors.shadowBlue, 0.06)}`,
  },
  cta: {
    boxShadow: `0px 9px 36px ${withAlpha(colors.shadowInk, 0.22)}`,
  },
} satisfies Record<string, ViewStyle>;
