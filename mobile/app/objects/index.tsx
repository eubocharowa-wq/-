import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppText } from '../../components/ui/AppText';
import { ObjectListCard } from '../../components/objects/ObjectListCard';
import { FilterChips } from '../../components/objects/FilterChips';
import { colors, layout, spacing } from '../../constants/theme';
import { useObjectsStore } from '../../store/useObjectsStore';
import { computeDashboard } from '../../store/dashboard';

export default function ObjectsListScreen() {
  const router = useRouter();
  const objects = useObjectsStore((s) => s.objects);
  const stats = useMemo(() => computeDashboard(objects), [objects]);

  return (
    <Screen fullBleed>
      <FlatList
        style={{ flex: 1 }}
        data={objects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="sectionLabel">Инвестиционное досье</AppText>
            <AppText variant="display" style={styles.headerTitle}>
              Объекты и проекты
            </AppText>
            <AppText variant="muted" style={styles.headerSubtitle}>
              Объекты в работе Центра Бизнес Инвестиций: документы, экономика, риски и этапы — без обещаний доходности.
            </AppText>

            <View style={styles.miniRow}>
              <MiniStat label="Всего объектов" value={objects.length} />
              <MiniStat label="В работе" value={stats.inWork} />
              <MiniStat label="Стоп-факторы" value={stats.withStopFactors} tone="danger" />
              <MiniStat label="В сделке" value={stats.dealsInProgress} tone="success" />
            </View>

            <Card variant="flat" style={styles.filterCard}>
              <AppText variant="sectionLabel" style={{ marginBottom: spacing.sm }}>
                Фильтры
              </AppText>
              <AppText variant="small" style={{ marginBottom: spacing.md }}>
                Визуальные фильтры — пока не влияют на список объектов.
              </AppText>
              <FilterChips />
            </Card>

            <Button
              title="Добавить объект"
              onPress={() => router.push('/objects/new')}
              size="lg"
              fullWidth
              style={styles.addCta}
            />
            <Button
              title="Передать на экспертный разбор"
              onPress={() => router.push('/home')}
              size="md"
              variant="outline"
              fullWidth
              style={styles.handoffCta}
            />
          </View>
        }
        renderItem={({ item }) => <ObjectListCard object={item} />}
      />
    </Screen>
  );
}

function MiniStat({
  label,
  value,
  tone = 'primary',
}: {
  label: string;
  value: number;
  tone?: 'primary' | 'danger' | 'success';
}) {
  const accent =
    tone === 'danger' ? colors.danger : tone === 'success' ? colors.success : colors.primary;
  return (
    <View style={styles.miniStat}>
      <AppText style={[styles.miniValue, { color: accent }]}>{value}</AppText>
      <AppText variant="small" style={styles.miniLabel}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    marginTop: spacing.xs,
  },
  headerSubtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  miniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  miniStat: {
    flexGrow: 1,
    minWidth: 100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  miniLabel: {
    marginTop: 2,
    color: colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontSize: 11,
  },
  filterCard: {
    marginBottom: spacing.lg,
  },
  addCta: {
    marginBottom: spacing.sm,
  },
  handoffCta: {
    marginBottom: spacing.md,
  },
});
