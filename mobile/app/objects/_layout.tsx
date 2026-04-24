import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

export default function ObjectsStackLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.gold,
        headerTitleStyle: { color: colors.textStrong, fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        headerBackTitle: 'Назад',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Объекты и проекты' }} />
      <Stack.Screen name="new" options={{ title: 'Новый объект' }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
