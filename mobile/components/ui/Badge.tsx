import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radii, spacing } from '../../constants/theme';

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'warning'
  | 'danger'
  | 'success'
  | 'stop'
  | 'outline';

type Size = 'sm' | 'md';

const toneStyles: Record<BadgeTone, { bg: string; border: string; text: string }> = {
  neutral: { bg: colors.softNeutral, border: colors.border, text: colors.text },
  primary: { bg: colors.softGreen, border: colors.primary, text: '#A8D1BE' },
  warning: { bg: colors.softWarning, border: '#5E4A1E', text: colors.goldBright },
  danger: { bg: colors.softDanger, border: '#5E2929', text: '#E4A3A3' },
  success: { bg: colors.softGreen, border: colors.primary, text: '#8FCBAF' },
  stop: { bg: '#8A2D2D', border: '#A24242', text: colors.textStrong },
  outline: { bg: 'transparent', border: colors.borderStrong, text: colors.text },
};

export function Badge({
  label,
  tone = 'neutral',
  size = 'sm',
}: {
  label: string;
  tone?: BadgeTone;
  size?: Size;
}) {
  const t = toneStyles[tone];
  const padY = size === 'md' ? 6 : 4;
  const padX = size === 'md' ? spacing.md : spacing.sm + 2;
  const fontSize = size === 'md' ? 12 : 11;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: t.bg,
          borderColor: t.border,
          paddingVertical: padY,
          paddingHorizontal: padX,
        },
      ]}
    >
      <AppText
        style={[styles.text, { color: t.text, fontSize, letterSpacing: tone === 'stop' ? 0.6 : 0.3 }]}
        numberOfLines={2}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    borderWidth: 1,
    maxWidth: '100%',
  },
  text: {
    fontWeight: '700',
    textTransform: 'none',
  },
});
