import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/theme';

const palette = [
  colors.accent,
  colors.success,
  colors.orange,
  colors.danger,
  colors.gradientPink,
  colors.gradientBlue,
];

type PieceConfig = {
  color: string;
  left: number;
  size: number;
  drift: number;
  rotation: number;
  delay: number;
  duration: number;
  square: boolean;
};

export function Confetti({ count = 80 }: { count?: number }) {
  const { width, height } = useWindowDimensions();
  const [pieces] = useState<PieceConfig[]>(() =>
    Array.from({ length: count }, () => ({
      color: palette[Math.floor(Math.random() * palette.length)],
      left: Math.random() * width,
      size: 7 + Math.random() * 7,
      drift: (Math.random() - 0.5) * 160,
      rotation: (Math.random() - 0.5) * 900,
      delay: Math.random() * 400,
      duration: 1700 + Math.random() * 1400,
      square: Math.random() > 0.5,
    })),
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece, index) => (
        <ConfettiPiece key={index} piece={piece} fallTo={height + 40} />
      ))}
    </View>
  );
}

function ConfettiPiece({ piece, fallTo }: { piece: PieceConfig; fallTo: number }) {
  const progress = useDerivedValue(() =>
    withDelay(
      piece.delay,
      withTiming(1, { duration: piece.duration, easing: Easing.out(Easing.quad) }),
    ),
  );

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-40, fallTo]) },
      { translateX: interpolate(progress.value, [0, 1], [0, piece.drift]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, piece.rotation])}deg` },
    ],
    opacity: interpolate(progress.value, [0, 0.85, 1], [1, 1, 0]),
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.left,
          width: piece.size,
          height: piece.size,
          borderRadius: piece.square ? 1.5 : piece.size / 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
});
