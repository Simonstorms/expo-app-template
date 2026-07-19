import { SymbolView, type SymbolViewProps, type SymbolWeight } from 'expo-symbols';
import { type StyleProp, type ViewStyle } from 'react-native';

export function Icon({
  name,
  size = 17,
  width,
  height,
  color,
  weight = 'regular',
  style,
}: {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      name={name as SymbolViewProps['name']}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[{ width: width ?? size, height: height ?? size }, style]}
    />
  );
}
