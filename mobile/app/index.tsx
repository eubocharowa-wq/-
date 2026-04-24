import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../components/ui/AppText';
import { colors, spacing } from '../constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/home');
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <View style={styles.markWrap}>
        <AppText style={styles.mark}>ЦБИ</AppText>
      </View>
      <AppText style={styles.brand}>Центр Бизнес Инвестиций</AppText>
      <AppText style={styles.subBrand}>Кабинет инвестора</AppText>
      <AppText style={styles.tagline}>Не продаю — отбираю</AppText>
      <ActivityIndicator color={colors.gold} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  markWrap: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  mark: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
  },
  brand: {
    color: colors.textStrong,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  subBrand: {
    marginTop: 4,
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tagline: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
