import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';
import { ECONOMY_SCENARIO_LABELS } from '../../../types/models';
import type { EconomyScenarioKind } from '../../../types/models';

function scenarioTone(kind: EconomyScenarioKind): BadgeTone {
  if (kind === 'base') return 'primary';
  if (kind === 'cautious') return 'warning';
  return 'danger';
}

function scenarioAccent(kind: EconomyScenarioKind): string {
  if (kind === 'base') return colors.primary;
  if (kind === 'cautious') return colors.warning;
  return colors.danger;
}

export default function ObjectEconomyTab() {
  const { object } = useObjectDetail();

  if (!object) {
    return (
      <Screen scroll>
        <AppText variant="body">Объект не найден.</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Экономика и сценарии
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Расчётные сценарии при заданных вводных. Не являются прогнозом доходности или инвестиционной рекомендацией.
      </AppText>

      {object.economyScenarios.map((sc) => (
        <Card key={sc.kind} style={styles.card}>
          <View style={[styles.accent, { backgroundColor: scenarioAccent(sc.kind) }]} />

          <View style={styles.body}>
            <View style={styles.topRow}>
              <AppText variant="subtitle" style={styles.title}>
                {ECONOMY_SCENARIO_LABELS[sc.kind]}
              </AppText>
              <Badge label={sc.kind === 'base' ? 'Базовый' : sc.kind === 'cautious' ? 'Осторожный' : 'Стресс'} tone={scenarioTone(sc.kind)} />
            </View>

            <View style={styles.factsGrid}>
              <Fact label="Цена входа" value={sc.entryPriceLabel} />
              <Fact label="Дополнительные затраты" value={sc.additionalCostsLabel} />
              <Fact label="Срок / горизонт" value={sc.realizationHorizonLabel} />
              <Fact label="Резерв" value={sc.reserveLabel} />
            </View>

            <View style={styles.sensitivity}>
              <AppText variant="sectionLabel" style={styles.sensitivityLabel}>
                Ключевой чувствительный фактор
              </AppText>
              <AppText variant="body" style={styles.sensitivityText}>
                {sc.sensitivityFactor}
              </AppText>
            </View>

            <View style={styles.conclusion}>
              <AppText variant="sectionLabel">Краткий вывод</AppText>
              <AppText variant="bodyStrong" style={styles.conclusionText}>
                {sc.conclusion}
              </AppText>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <AppText variant="sectionLabel" style={styles.factLabel}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={styles.factValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  subheader: {
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.textStrong,
  },
  factsGrid: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  fact: {
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
  },
  factLabel: {
    marginBottom: spacing.xs,
    color: colors.muted,
  },
  factValue: {
    color: colors.textStrong,
  },
  sensitivity: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.softWarning,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5E4A1E',
  },
  sensitivityLabel: {
    color: colors.goldBright,
    marginBottom: spacing.xs,
  },
  sensitivityText: {
    color: colors.textStrong,
  },
  conclusion: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  conclusionText: {
    marginTop: spacing.sm,
    color: colors.textStrong,
  },
});
