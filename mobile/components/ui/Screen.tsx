import {
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewStyle,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '../../constants/theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  /** Отключить центрирование max-width (например, для FlatList-обёрток). */
  fullBleed?: boolean;
} & Omit<ScrollViewProps, 'children' | 'style' | 'contentContainerStyle'>;

export function Screen({
  children,
  scroll,
  contentContainerStyle,
  style,
  fullBleed,
  ...scrollProps
}: Props) {
  const contentMax: ViewStyle = fullBleed
    ? {}
    : { maxWidth: layout.maxContentWidth, width: '100%', alignSelf: 'center' };

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, contentMax, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]} edges={['top', 'left', 'right']}>
      <View style={[styles.fill, contentMax]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
});
