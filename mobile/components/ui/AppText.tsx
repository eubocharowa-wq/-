import { Text, type TextProps, type TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

type Variant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'sectionLabel'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'small'
  | 'muted'
  | 'mono';

const variantStyles: Record<Variant, TextStyle> = {
  display: {
    fontSize: typography.display,
    fontWeight: '700',
    color: colors.textStrong,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.textStrong,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: typography.subtitle,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: typography.small,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  bodyStrong: {
    fontSize: typography.body,
    color: colors.textStrong,
    fontWeight: '600',
    lineHeight: 22,
  },
  caption: {
    fontSize: typography.caption,
    color: colors.text,
    lineHeight: 18,
    fontWeight: '500',
  },
  small: {
    fontSize: typography.small,
    color: colors.muted,
    lineHeight: 16,
  },
  muted: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  mono: {
    fontSize: typography.caption,
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
};

export function AppText({
  variant = 'body',
  style,
  ...rest
}: TextProps & { variant?: Variant }) {
  return <Text style={[variantStyles[variant], style]} {...rest} />;
}

export const textStyles = StyleSheet.create({
  primaryAccent: { color: colors.gold, fontWeight: '700' },
  onPrimary: { color: colors.textStrong, fontWeight: '600' },
});
