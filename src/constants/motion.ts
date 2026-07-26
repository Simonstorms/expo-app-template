import { Easing } from 'react-native-reanimated';

export const motion = {
  pressIn: 110,
  pressOut: 200,
  enter: 280,
  stagger: 45,
  easeOut: Easing.bezier(0.23, 1, 0.32, 1),
} as const;
