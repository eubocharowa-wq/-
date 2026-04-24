import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';
import type { InvestmentObject } from '../../../types/models';
import {
  ASSET_TYPE_LABELS,
  PIPELINE_STATUS_LABELS,
  RISK_LEVEL_LABELS,
} from '../../../types/models';

function riskTone(level: InvestmentObject['riskLevel']): BadgeTone {
  if (level === 'low') return 'success';
  if (level === 'medium') return 'warning';
  return 'danger';
}

function pipelineTone(status: InvestmentObject['pipelineStatus']): BadgeTone {
  if (status === 'needs_decision') return 'warning';
  if (status === 'stopped') return 'danger';
  if (status === 'deal_in_progress') return 'success';
  return 'primary';
}

export default function ObjectOverviewTab() {
  const { object } = useObjectDetail();
  const router = useRouter();

  if (!object) {
    return (
      <Screen scroll>
        <AppText variant="body">Объект не найден.</AppText>
        <Button title="Назад к списку" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Card variant="hero" style={styles.hero}>
        <AppText style={styles.heroTag}>Инвестиционное досье</AppText>
        <AppText style={styles.heroName} numberOfLines={3}>
          {object.name}
        </AppText>
        <AppText style={styles.heroAddress}>{object.address}</AppText>

        <View style={styles.heroBadges}>
          <Badge label={ASSET_TYPE_LABELS[object.assetType]} tone="outline" />
          <Badge label={PIPELINE_STATUS_LABELS[object.pipelineStatus]} tone={pipelineTone(object.pipelineStatus)} />
          <Badge label={`Риск: ${RISK_LEVEL_LABELS[object.riskLevel]}`} tone={riskTone(object.riskLevel)} />
          {object.hasStopFactors ? <Badge label="СТОП-ФАКТОР" tone="stop" /> : null}
        </View>
      </Card>

      <View style={styles.kpiRow}>
        <KpiBlock label="Цена входа" value={object.entryPriceLabel} />
        <KpiBlock label="Сценарий входа" value={object.scenarioLabel} />
      </View>

      <Card style={styles.section}>
        <AppText variant="sectionLabel" style={styles.sectionLabel}>
          Инвестиционный тезис
        </AppText>
        <AppText variant="body" style={styles.sectionBody}>
          {object.investmentThesis}
        </AppText>
      </Card>

      <Card style={styles.section} variant="accent">
        <AppText variant="sectionLabel" style={styles.sectionLabel}>
          Вывод на сегодня
        </AppText>
        <AppText variant="bodyStrong" style={styles.sectionBody}>
          {object.todaySummary}
        </AppText>
      </Card>

      <View style={styles.actionRow}>
        <Button
          title="К документам"
          onPress={() => router.push(`/objects/${object.id}/documents`)}
          size="sm"
          variant="outline"
        />
        <Button
          title="К рискам"
          onPress={() => router.push(`/objects/${object.id}/risks`)}
          size="sm"
          variant="outline"
        />
        <Button
          title="К сделке"
          onPress={() => router.push(`/objects/${object.id}/deal`)}
          size="sm"
          variant="primary"
        />
      </View>
    </Screen>
  );
}

function KpiBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <AppText variant="sectionLabel" style={styles.kpiLabel}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={styles.kpiValue}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.sm,
  },
  heroTag: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  heroName: {
    marginTop: spacing.sm,
    color: colors.textStrong,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  heroAddress: {
    marginTop: spacing.md,
    color: 'rgba(244, 239, 230, 0.82)',
    fontSize: 14,
    lineHeight: 20,
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  kpiRow: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  kpi: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: {
    marginBottom: spacing.sm,
  },
  kpiValue: {
    fontSize: 16,
    color: colors.textStrong,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  sectionBody: {
    color: colors.textStrong,
  },
  actionRow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
