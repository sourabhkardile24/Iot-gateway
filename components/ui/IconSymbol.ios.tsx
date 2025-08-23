import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';
import { IconSymbolName } from './IconSymbol';

// Cast string to the specific SF Symbol enum type to avoid TypeScript errors
const asSymbol = (name: string) => name as SymbolViewProps['name'];

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={asSymbol(name)}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
