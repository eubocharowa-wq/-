import { View, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { spacing } from '../../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  rowStyle?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'children' | 'style'>;

export function ListRow({ title, subtitle, right, onPress, rowStyle, ...rest }: Props) {
  const inner = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <View style={{ flex: 1 }}>
        <AppText variant="caption">{title}</AppText>
        {subtitle ? (
          <AppText variant="muted" style={{ marginTop: 4 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, rowStyle]}
        {...rest}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{inner}</View>;
}
