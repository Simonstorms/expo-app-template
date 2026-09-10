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

const SEGMENTS = 90;

function ringColor(t: number): string {
  const [firstStop] = STOPS;
  let lower = firstStop;
  let upper = STOPS.at(-1) ?? firstStop;
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const current = STOPS[i];
    const following = STOPS[i + 1];
    if (t >= current.at && t <= following.at) {
      lower = current;
      upper = following;
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

function segmentPath(index: number, cx: number, cy: number, radius: number): string {
  const t0 = index / SEGMENTS;
  const t1 = (index + 1) / SEGMENTS;
  const a0 = t0 * 2 * Math.PI - Math.PI / 2;
  const a1 = t1 * 2 * Math.PI - Math.PI / 2 + 0.012;
  const x0 = cx + radius * Math.cos(a0);
  const y0 = cy + radius * Math.sin(a0);
  const x1 = cx + radius * Math.cos(a1);
  const y1 = cy + radius * Math.sin(a1);
  return `M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
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
  const innerSize = diameter - ringWidth;

  return (
    <View style={[styles.ring, { width: diameter, height: diameter }]}>
      <Svg width={diameter} height={diameter} style={StyleSheet.absoluteFill}>
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <Path
            key={index}
            d={segmentPath(index, cx, cy, radius)}
            stroke={ringColor(index / SEGMENTS)}
            strokeWidth={ringWidth}
            fill="none"
          />
        ))}
      </Svg>
      <View
        style={[styles.inner, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    position: 'absolute',
    backgroundColor: colors.white,
  },
});
