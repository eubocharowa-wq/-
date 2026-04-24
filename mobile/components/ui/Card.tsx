import { View, type ViewProps, StyleSheet } from 'react-native';
import { colors, elevation, radii, spacing } from '../../constants/theme';

type Variant = 'default' | 'hero' | 'accent' | 'flat';

export function Card({
  style,
  variant = 'default',
  ...rest
}: ViewProps & { variant?: Variant }) {
  return (
    <View
      style={[
        styles.base,
        variant === 'default' && styles.default,
        variant === 'hero' && styles.hero,
        variant === 'accent' && styles.accent,
        variant === 'flat' && styles.flat,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  default: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.card,
  },
  hero: {
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...elevation.hero,
  },
  accent: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderAccent,
  },
  flat: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
