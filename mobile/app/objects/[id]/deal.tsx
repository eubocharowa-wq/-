import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge, type BadgeTone } from '../../../components/ui/Badge';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';
import type { DealStageStatus } from '../../../types/models';

function stageTone(s: DealStageStatus): BadgeTone {
  if (s === 'done') return 'success';
  if (s === 'in_progress') return 'primary';
  if (s === 'blocked') return 'danger';
  return 'neutral';
}

function stageLabel(s: DealStageStatus) {
  if (s === 'done') return 'Готово';
  if (s === 'in_progress') return 'В работе';
  if (s === 'blocked') return 'Блок';
  return 'Ожидает';
}

function stageAccent(s: DealStageStatus): string {
  if (s === 'done') return colors.success;
  if (s === 'in_progress') return colors.primary;
  if (s === 'blocked') return colors.danger;
  return colors.border;
}

export default function ObjectDealTab() {
  const { object } = useObjectDetail();

  const summary = useMemo(() => {
    const s = { done: 0, in_progress: 0, blocked: 0, pending: 0 };
    object?.dealStages.forEach((st) => {
      s[st.status] += 1;
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

  const stages = [...object.dealStages].sort((a, b) => a.order - b.order);
  const total = stages.length;
  const completed = summary.done;
  const progress = total > 0 ? completed / total : 0;

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Этапы сделки
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Рабочая дорожная карта по объекту. Статусы и дедлайны требуют регулярного обновления.
      </AppText>

      <Card style={styles.progressCard}>
        <AppText variant="sectionLabel">Прогресс</AppText>
        <View style={styles.progressTopRow}>
          <AppText style={styles.progressValue}>
            {completed}/{total}
          </AppText>
          <AppText variant="muted">этапов завершено</AppText>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <View style={styles.progressBadges}>
          <Badge label={`В работе: ${summary.in_progress}`} tone="primary" />
          <Badge label={`Блок: ${summary.blocked}`} tone="danger" />
          <Badge label={`Ожидает: ${summary.pending}`} tone="neutral" />
        </View>
      </Card>

      {stages.map((st) => (
        <Card key={st.key} style={styles.stageCard}>
          <View style={[styles.stageAccent, { backgroundColor: stageAccent(st.status) }]} />
          <View style={styles.stageBody}>
            <View style={styles.stageTop}>
              <View style={styles.stageTitleBlock}>
                <AppText variant="sectionLabel" style={styles.stageOrder}>
                  Этап {st.order}
                </AppText>
                <AppText variant="subtitle" style={styles.stageTitle}>
                  {st.title}
                </AppText>
              </View>
              <Badge label={stageLabel(st.status)} tone={stageTone(st.status)} size="md" />
            </View>

            <View style={styles.stageFacts}>
              <StageFact label="Дедлайн" value={st.deadline ?? 'не назначен'} muted={!st.deadline} />
              <StageFact label="Ответственный" value={st.owner ?? '—'} muted={!st.owner} />
            </View>

            {st.transitionBlocker && st.transitionBlocker !== '—' ? (
              <View style={styles.blocker}>
                <AppText variant="sectionLabel" style={styles.blockerLabel}>
                  Блокер перехода
                </AppText>
                <AppText variant="body" style={styles.blockerText}>
                  {st.transitionBlocker}
                </AppText>
              </View>
            ) : null}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

function StageFact({ label, value, muted }: { label: string; value: string; muted: boolean }) {
  return (
    <View style={styles.stageFact}>
      <AppText variant="sectionLabel" style={styles.stageFactLabel}>
        {label}
      </AppText>
      <AppText
        style={[
          styles.stageFactValue,
          { color: muted ? colors.muted : colors.textStrong, fontWeight: muted ? '500' : '700' },
        ]}
      >
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
  progressCard: {
    marginBottom: spacing.xl,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textStrong,
    letterSpacing: -0.6,
  },
  progressBar: {
    marginTop: spacing.md,
    height: 8,
    backgroundColor: colors.softNeutral,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressBadges: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stageCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stageAccent: {
    width: 4,
  },
  stageBody: {
    flex: 1,
    padding: spacing.lg,
  },
  stageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stageTitleBlock: {
    flex: 1,
  },
  stageOrder: {
    color: colors.muted,
    marginBottom: 2,
  },
  stageTitle: {
    color: colors.textStrong,
  },
  stageFacts: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  stageFact: {
    flexGrow: 1,
    minWidth: 140,
  },
  stageFactLabel: {
    color: colors.muted,
    marginBottom: 2,
  },
  stageFactValue: {
    fontSize: 14,
  },
  blocker: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.softDanger,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5E2929',
  },
  blockerLabel: {
    color: '#E4A3A3',
    marginBottom: spacing.xs,
  },
  blockerText: {
    color: colors.textStrong,
  },
});
