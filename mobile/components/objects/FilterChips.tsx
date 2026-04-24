import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../ui/AppText';
import { colors, radii, spacing } from '../../constants/theme';

const FILTERS = [
  { id: 'asset', label: 'Тип актива' },
  { id: 'status', label: 'Статус' },
  { id: 'risk', label: 'Риск' },
  { id: 'region', label: 'Регион' },
] as const;

/** Визуальные фильтры без логики списка (MVP). */
export function FilterChips() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <View style={styles.wrap}>
      {FILTERS.map((f) => {
        const on = active === f.id;
        return (
          <Pressable
            key={f.id}
            onPress={() => setActive((prev) => (prev === f.id ? null : f.id))}
            style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && { opacity: 0.9 }]}
          >
            <AppText
              style={{
                color: on ? '#1A150C' : colors.gold,
                fontWeight: '700',
                fontSize: 12,
                letterSpacing: 0.4,
              }}
            >
              {f.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    backgroundColor: 'transparent',
  },
  chipOn: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
});
