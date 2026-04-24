import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors, elevation, radii, spacing } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
} & PressableProps;

const sizePadding: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 10, paddingHorizontal: spacing.lg },
  md: { paddingVertical: 14, paddingHorizontal: spacing.xl },
  lg: { paddingVertical: 16, paddingHorizontal: spacing.xl },
};

const sizeFont: Record<Size, number> = {
  sm: 13,
  md: 15,
  lg: 16,
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  leftIcon,
  rightIcon,
  fullWidth,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => {
        const extra: StyleProp<ViewStyle> =
          typeof style === 'function' ? style(state) : style;
        return [
          styles.base,
          sizePadding[size],
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'outline' && styles.outline,
          variant === 'ghost' && styles.ghost,
          variant === 'danger' && styles.danger,
          fullWidth && { alignSelf: 'stretch' },
          disabled && styles.disabled,
          state.pressed && !disabled && variant === 'primary' && styles.primaryPressed,
          state.pressed && !disabled && variant === 'danger' && styles.dangerPressed,
          state.pressed && !disabled && variant === 'outline' && styles.outlinePressed,
          state.pressed && !disabled && variant === 'ghost' && styles.ghostPressed,
          state.pressed && !disabled && variant === 'secondary' && styles.secondaryPressed,
          extra,
        ];
      }}
      {...rest}
    >
      <View style={styles.inner}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <AppText
          style={[
            styles.label,
            { fontSize: sizeFont[size] },
            variant === 'primary' && styles.labelOnPrimary,
            variant === 'secondary' && styles.labelOnSecondary,
            variant === 'outline' && styles.labelOutline,
            variant === 'ghost' && styles.labelGhost,
            variant === 'danger' && styles.labelOnDanger,
          ]}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.gold,
    ...elevation.card,
  },
  primaryPressed: {
    backgroundColor: '#B89344',
  },
  secondary: {
    backgroundColor: colors.primary,
  },
  secondaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  outlinePressed: {
    backgroundColor: colors.overlay,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: colors.overlay,
  },
  danger: {
    backgroundColor: '#7A2A2A',
    borderWidth: 1,
    borderColor: '#A24242',
  },
  dangerPressed: {
    backgroundColor: '#5C1F1F',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelOnPrimary: {
    color: '#1A150C',
  },
  labelOnDanger: {
    color: colors.textStrong,
  },
  labelOnSecondary: {
    color: colors.textStrong,
  },
  labelOutline: {
    color: colors.gold,
  },
  labelGhost: {
    color: colors.gold,
  },
});
