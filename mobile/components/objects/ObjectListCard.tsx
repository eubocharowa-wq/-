import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { InvestmentObject } from '../../types/models';
import {
  ASSET_TYPE_LABELS,
  PIPELINE_STATUS_LABELS,
  RISK_LEVEL_LABELS,
} from '../../types/models';
import { Card } from '../ui/Card';
import { AppText } from '../ui/AppText';
import { Badge, type BadgeTone } from '../ui/Badge';
import { Button } from '../ui/Button';
import { colors, radii, spacing } from '../../constants/theme';

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

export function ObjectListCard({ object }: { object: InvestmentObject }) {
  const router = useRouter();
  const hasStop = object.hasStopFactors;

  const goToDossier = () => router.push(`/objects/${object.id}/overview`);

  return (
    <Pressable onPress={goToDossier} style={({ pressed }) => [styles.press, pressed && styles.pressed]}>
      <Card style={styles.card}>
        {hasStop ? (
          <View style={styles.stopStrip}>
            <AppText style={styles.stopLabel}>СТОП-ФАКТОР</AppText>
          </View>
        ) : null}

        <View style={styles.topRow}>
          <Badge label={ASSET_TYPE_LABELS[object.assetType]} tone="outline" />
          <Badge label={object.region} tone="neutral" />
        </View>

        <AppText variant="subtitle" style={styles.name} numberOfLines={2}>
          {object.name}
        </AppText>

        <View style={styles.factRow}>
          <FactItem label="Цена входа" value={object.entryPriceLabel} />
          <FactItem label="Сценарий" value={object.scenarioLabel} />
        </View>

        <View style={styles.badgeRow}>
          <Badge label={PIPELINE_STATUS_LABELS[object.pipelineStatus]} tone={pipelineTone(object.pipelineStatus)} />
          <Badge label={`Риск: ${RISK_LEVEL_LABELS[object.riskLevel]}`} tone={riskTone(object.riskLevel)} />
        </View>

        <View style={styles.conclusion}>
          <AppText variant="sectionLabel" style={styles.conclusionLabel}>
            Краткий вывод
          </AppText>
          <AppText variant="body" style={styles.conclusionText}>
            {object.shortConclusion}
          </AppText>
        </View>

        <Button title="Открыть досье" size="sm" variant="primary" onPress={goToDossier} style={styles.cta} />
      </Card>
    </Pressable>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <AppText variant="small" style={styles.factLabel}>
        {label}
      </AppText>
      <AppText variant="bodyStrong" style={styles.factValue} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  press: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    padding: spacing.lg,
  },
  stopStrip: {
    alignSelf: 'flex-start',
    backgroundColor: '#8A2D2D',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  stopLabel: {
    color: colors.textStrong,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  name: {
    marginTop: spacing.md,
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  factRow: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  fact: {
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
  },
  factLabel: {
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  factValue: {
    marginTop: 2,
  },
  badgeRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  conclusion: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  conclusionLabel: {
    marginBottom: spacing.xs,
  },
  conclusionText: {
    color: colors.textStrong,
  },
  cta: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
  },
});
