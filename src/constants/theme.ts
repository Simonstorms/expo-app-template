import { type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  ink: '#000000',
  ctaFill: '#1E1A24',
  cardFill: '#F9F8FD',
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
  gradientPink: '#F2BCD4',
  gradientBlue: '#B6C6F5',
  white: '#FFFFFF',
} as const;

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
    shadowColor: '#14284C',
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  soft: {
    shadowColor: '#14284C',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cta: {
    shadowColor: '#28282D',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 5,
  },
} satisfies Record<string, ViewStyle>;

export function withAlpha(hex: string, alpha: number): string {
  'worklet';
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
