import type { ReactNode } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { colors, shadow, withAlpha } from '@/constants/theme';

const FRAME_ASPECT = 0.487;
const BEZEL_RATIO = 0.032;
const FRAME_RADIUS_RATIO = 0.155;

export function PhoneMockup({
  width,
  screenColor = colors.white,
  frameColor = colors.ink,
  style,
  children,
}: {
  width: number;
  screenColor?: string;
  frameColor?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const height = width / FRAME_ASPECT;
  const bezel = Math.max(3, Math.round(width * BEZEL_RATIO));
  const frameRadius = width * FRAME_RADIUS_RATIO;
  const screenRadius = frameRadius - bezel;
  const islandWidth = (width - bezel * 2) * 0.34;
  const islandHeight = islandWidth * 0.3;

  return (
    <View
      style={[
        shadow.card,
        {
          width,
          height,
          borderRadius: frameRadius,
          borderCurve: 'continuous',
          backgroundColor: frameColor,
          borderWidth: 1,
          borderColor: withAlpha(colors.white, 0.22),
        },
        style,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          left: bezel,
          top: bezel,
          right: bezel,
          bottom: bezel,
          borderRadius: screenRadius,
          borderCurve: 'continuous',
          overflow: 'hidden',
          backgroundColor: screenColor,
        }}
      >
        {children}
      </View>
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: bezel + islandHeight * 0.55,
          width: islandWidth,
          height: islandHeight,
          borderRadius: islandHeight / 2,
          backgroundColor: frameColor,
        }}
      />
    </View>
  );
}
