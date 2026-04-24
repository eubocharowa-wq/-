import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { DOCUMENT_STATUS_LABELS } from '../../../types/models';
import type { DocumentStatus } from '../../../types/models';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';

function docTone(status: DocumentStatus): BadgeTone {
  if (status === 'received') return 'success';
  if (status === 'has_remarks') return 'warning';
  if (status === 'not_provided') return 'danger';
  if (status === 'under_review') return 'primary';
  return 'neutral';
}

function docAccent(status: DocumentStatus): string {
  if (status === 'received') return colors.success;
  if (status === 'has_remarks') return colors.warning;
  if (status === 'not_provided') return colors.danger;
  if (status === 'under_review') return colors.gold;
  return colors.border;
}

export default function ObjectDocumentsTab() {
  const { object } = useObjectDetail();

  const summary = useMemo(() => {
    const s = { received: 0, under_review: 0, has_remarks: 0, not_provided: 0, requested: 0 };
    object?.documents.forEach((d) => {
      s[d.status] += 1;
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

  if (object.documents.length === 0) {
    return (
      <Screen scroll>
        <Card variant="accent">
          <AppText variant="sectionLabel" style={{ marginBottom: spacing.sm }}>
            Документы ещё не заведены
          </AppText>
          <AppText variant="bodyStrong">
            Запросите базовый пакет документов по чек-листу Центра Бизнес Инвестиций.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Документы по объекту
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Статусы отражают ход запроса и проверки. Не заменяют юридическую квалификацию документов.
      </AppText>

      <View style={styles.summary}>
        <SummaryChip label="Получено" value={summary.received} tone={colors.success} />
        <SummaryChip label="На проверке" value={summary.under_review} tone={colors.gold} />
        <SummaryChip label="Замечания" value={summary.has_remarks} tone={colors.warning} />
        <SummaryChip label="Не предоставлено" value={summary.not_provided} tone={colors.danger} />
      </View>

      {object.documents.map((d) => (
        <Card key={d.id} style={styles.card}>
          <View style={[styles.docAccent, { backgroundColor: docAccent(d.status) }]} />
          <View style={styles.docBody}>
            <AppText variant="bodyStrong" style={styles.docTitle} numberOfLines={3}>
              {d.title}
            </AppText>
            <View style={styles.docBadgeRow}>
              <Badge label={DOCUMENT_STATUS_LABELS[d.status]} tone={docTone(d.status)} size="md" />
            </View>
          </View>
        </Card>
      ))}
    </Screen>
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
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  card: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  docAccent: {
    width: 4,
  },
  docBody: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  docTitle: {
    color: colors.textStrong,
    fontSize: 16,
    lineHeight: 22,
  },
  docBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
