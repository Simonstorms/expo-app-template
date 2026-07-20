import { type TextStyle } from 'react-native';

export const colors = {
  ink: '#000000',
  ctaFill: '#1E1A24',
  cardFill: '#F9F8FD',
  secondaryText: '#706F72',
  disabledFill: '#BABABC',
  progressTrack: '#E8E8E8',
  hairline: '#E8E8E9',
  cardStroke: '#E9E9E9',
  orange: '#DE9B68',
  gradientPink: '#F2BCD4',
  gradientBlue: '#B6C6F5',
  white: '#FFFFFF',
} as const;

export const layout = {
  margin: 24,
  ctaMargin: 16,
  cardRadius: 16,
  ctaHeight: 58,
  chipSize: 39,
} as const;

export const backgroundGradient = {
  colors: ['#FFFFFF', '#FFFFFF', '#F7F7F8'] as const,
  locations: [0, 0.6, 1] as const,
};

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

export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
