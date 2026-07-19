import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants/theme';

type Stop = { at: number; color: [number, number, number] };

const PINK: [number, number, number] = [242, 188, 212];
const BLUE: [number, number, number] = [182, 198, 245];
const PINK_FADED: [number, number, number] = [247, 217, 230];

const STOPS: Stop[] = [
  { at: 0, color: PINK },
  { at: 0.25, color: BLUE },
  { at: 0.5, color: PINK_FADED },
  { at: 0.75, color: BLUE },
  { at: 1, color: PINK },
];

function ringColor(t: number): string {
  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (t >= STOPS[i].at && t <= STOPS[i + 1].at) {
      lower = STOPS[i];
      upper = STOPS[i + 1];
      break;
    }
  }
  const span = upper.at - lower.at || 1;
  const f = (t - lower.at) / span;
  const r = Math.round(lower.color[0] + (upper.color[0] - lower.color[0]) * f);
  const g = Math.round(lower.color[1] + (upper.color[1] - lower.color[1]) * f);
  const b = Math.round(lower.color[2] + (upper.color[2] - lower.color[2]) * f);
  return `rgb(${r}, ${g}, ${b})`;
}

export function GradientRing({
  diameter = 200,
  ringWidth = 26,
  children,
}: {
  diameter?: number;
  ringWidth?: number;
  children?: ReactNode;
}) {
  const radius = (diameter - ringWidth) / 2;
  const cx = diameter / 2;
  const cy = diameter / 2;
  const segments = 90;
  const innerSize = diameter - ringWidth;

  const paths = [];
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    const a0 = t0 * 2 * Math.PI - Math.PI / 2;
    const a1 = t1 * 2 * Math.PI - Math.PI / 2 + 0.012;
    const x0 = cx + radius * Math.cos(a0);
    const y0 = cy + radius * Math.sin(a0);
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    paths.push(
      <Path
        key={i}
        d={`M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`}
        stroke={ringColor(t0)}
        strokeWidth={ringWidth}
        fill="none"
      />,
    );
  }

  return (
    <View style={{ width: diameter, height: diameter, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={diameter} height={diameter} style={StyleSheet.absoluteFill}>
        {paths}
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: colors.white,
        }}
      />
      {children}
    </View>
  );
}
