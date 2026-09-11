import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

export type IconName = SymbolViewProps['name'];

export function Icon({
  name,
  size = 17,
  width,
  height,
  color,
  weight = 'regular',
  style,
}: {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
  color?: ColorValue;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[{ width: width ?? size, height: height ?? size }, style]}
    />
  );
}
