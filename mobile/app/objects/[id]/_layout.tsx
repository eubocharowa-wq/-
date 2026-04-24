import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';

export default function ObjectDetailTabsLayout() {
  const { object } = useObjectDetail();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: object?.name ?? 'Инвестиционное досье',
        headerTintColor: colors.gold,
        headerTitleStyle: { color: colors.textStrong, fontWeight: '700', fontSize: 15 },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.select({ ios: 78, android: 64, web: 60, default: 64 }),
          paddingTop: 6,
          paddingBottom: Platform.select({ ios: 20, android: 8, web: 8, default: 8 }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        },
        tabBarItemStyle: { paddingVertical: 2 },
      }}
    >
      <Tabs.Screen name="overview" options={{ title: 'Обзор' }} />
      <Tabs.Screen name="sourcedata" options={{ title: 'Вводные' }} />
      <Tabs.Screen name="documents" options={{ title: 'Документы' }} />
      <Tabs.Screen name="economy" options={{ title: 'Экономика' }} />
      <Tabs.Screen name="risks" options={{ title: 'Риски' }} />
      <Tabs.Screen name="deal" options={{ title: 'Сделка' }} />
      <Tabs.Screen name="journal" options={{ title: 'Решения' }} />
    </Tabs>
  );
}
