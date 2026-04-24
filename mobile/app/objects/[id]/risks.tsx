import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';
import type { RiskBucket, RiskItem, RiskLevel } from '../../../types/models';
import { RISK_BUCKET_LABELS, RISK_CATEGORY_LABELS, RISK_LEVEL_LABELS } from '../../../types/models';

const BUCKET_ORDER: RiskBucket[] = ['stop', 'mitigated_by_check', 'priced_in', 'consciously_accepted'];

function severityTone(level: RiskLevel, isStop: boolean): BadgeTone {
  if (isStop) return 'stop';
  if (level === 'low') return 'success';
  if (level === 'medium') return 'warning';
  return 'danger';
}

function severityAccent(level: RiskLevel, isStop: boolean): string {
  if (isStop) return colors.danger;
  if (level === 'low') return colors.success;
  if (level === 'medium') return colors.warning;
  return colors.danger;
}

function bucketAccent(b: RiskBucket): string {
  if (b === 'stop') return colors.danger;
  if (b === 'mitigated_by_check') return colors.primary;
  if (b === 'priced_in') return colors.warning;
  return colors.muted;
}

export default function ObjectRisksTab() {
  const { object } = useObjectDetail();

  const bucketSummary = useMemo(() => {
    const s: Record<RiskBucket, number> = {
      stop: 0,
      mitigated_by_check: 0,
      priced_in: 0,
      consciously_accepted: 0,
    };
    object?.risks.forEach((r) => {
      s[r.bucket] += 1;
    });
    return s;
  }, [object]);

  if (!object) {
    return (
      <Screen scroll>
        <AppText variant="body">Объект не найден.</AppText>
      </Screen>
    );
  }

  if (object.risks.length === 0) {
    return (
      <Screen scroll>
        <Card variant="accent">
          <AppText variant="sectionLabel" style={{ marginBottom: spacing.sm }}>
            Риски ещё не зафиксированы
          </AppText>
          <AppText variant="bodyStrong">
            После первичного скрининга заполните категории и уровни критичности.
          </AppText>
        </Card>
      </Screen>
    );
  }

  const grouped = BUCKET_ORDER.map((bucket) => ({
    bucket,
    items: object.risks.filter((r) => r.bucket === bucket),
  })).filter((g) => g.items.length > 0);

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Карта рисков
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Классификация помогает отделить стоп-факторы от управляемых вопросов. Формулировки предварительные.
      </AppText>

      <View style={styles.summaryRow}>
        <SummaryChip label="Стоп-факторы" value={bucketSummary.stop} tone={colors.danger} />
        <SummaryChip label="Снимаемые проверкой" value={bucketSummary.mitigated_by_check} tone={colors.primary} />
        <SummaryChip label="Учтены в цене" value={bucketSummary.priced_in} tone={colors.warning} />
        <SummaryChip label="Приняты сознательно" value={bucketSummary.consciously_accepted} tone={colors.muted} />
      </View>

      {grouped.map((g) => (
        <View key={g.bucket} style={styles.bucketBlock}>
          <View style={styles.bucketHeader}>
            <View style={[styles.bucketDot, { backgroundColor: bucketAccent(g.bucket) }]} />
            <AppText variant="subtitle" style={styles.bucketTitle}>
              {RISK_BUCKET_LABELS[g.bucket]}
            </AppText>
          </View>
          {g.items.map((r) => (
            <RiskCard key={r.id} risk={r} bucket={g.bucket} />
          ))}
        </View>
      ))}
    </Screen>
  );
}

function RiskCard({ risk, bucket }: { risk: RiskItem; bucket: RiskBucket }) {
  const isStop = bucket === 'stop';
  return (
    <Card style={styles.riskCard}>
      <View style={[styles.riskAccent, { backgroundColor: severityAccent(risk.severity, isStop) }]} />
      <View style={styles.riskBody}>
        <View style={styles.riskBadges}>
          <Badge label={RISK_CATEGORY_LABELS[risk.category]} tone="outline" />
          <Badge
            label={isStop ? 'СТОП-ФАКТОР' : `${RISK_LEVEL_LABELS[risk.severity]} риск`}
            tone={severityTone(risk.severity, isStop)}
          />
        </View>

        <AppText variant="subtitle" style={styles.riskTitle}>
          {risk.title}
        </AppText>
        <AppText variant="body" style={styles.riskDescription}>
          {risk.description}
        </AppText>

        <View style={styles.riskSection}>
          <AppText variant="sectionLabel" style={styles.riskSectionLabel}>
            Что проверить
          </AppText>
          <AppText variant="body" style={styles.riskSectionBody}>
            {risk.whatToVerify}
          </AppText>
        </View>

        <View style={styles.riskFooter}>
          <FooterItem
            label="Можно снять"
            value={risk.canBeMitigated ? 'Да' : 'Ограниченно'}
            tone={risk.canBeMitigated ? colors.success : colors.warning}
          />
          <FooterItem
            label="Влияет на решение"
            value={risk.affectsDecision ? 'Да' : 'Косвенно'}
            tone={risk.affectsDecision ? colors.danger : colors.muted}
          />
        </View>
      </View>
    </Card>
  );
}

function FooterItem({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View style={styles.footerItem}>
      <AppText variant="sectionLabel" style={styles.footerLabel}>
        {label}
      </AppText>
      <AppText style={[styles.footerValue, { color: tone }]}>{value}</AppText>
    </View>
  );
}

function SummaryChip({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <View style={styles.summaryChip}>
      <AppText style={[styles.summaryValue, { color: tone }]}>{value}</AppText>
      <AppText variant="small" style={styles.summaryLabel}>
        {label}
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  summaryChip: {
    flexGrow: 1,
    minWidth: 90,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  summaryLabel: {
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    fontSize: 10,
  },
  bucketBlock: {
    marginBottom: spacing.xl,
  },
  bucketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bucketDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bucketTitle: {
    color: colors.textStrong,
  },
  riskCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  riskAccent: {
    width: 4,
  },
  riskBody: {
    flex: 1,
    padding: spacing.lg,
  },
  riskBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  riskTitle: {
    marginTop: spacing.md,
    color: colors.textStrong,
  },
  riskDescription: {
    marginTop: spacing.sm,
    color: colors.text,
  },
  riskSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  riskSectionLabel: {
    color: colors.muted,
  },
  riskSectionBody: {
    marginTop: spacing.xs,
  },
  riskFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  footerItem: {
    flexGrow: 1,
    minWidth: 120,
  },
  footerLabel: {
    color: colors.muted,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});
