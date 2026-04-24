import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { Badge } from '../../../components/ui/Badge';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';

export default function ObjectJournalTab() {
  const { object } = useObjectDetail();

  if (!object) {
    return (
      <Screen scroll>
        <AppText variant="body">Объект не найден.</AppText>
      </Screen>
    );
  }

  const entries = [...object.decisionLog].sort((a, b) => b.date.localeCompare(a.date));

  if (entries.length === 0) {
    return (
      <Screen scroll>
        <Card variant="accent">
          <AppText variant="sectionLabel" style={{ marginBottom: spacing.sm }}>
            Журнал решений пуст
          </AppText>
          <AppText variant="bodyStrong">
            Здесь появятся зафиксированные решения по объекту и основания для них.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Журнал решений
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Фиксирует логику движения по объекту и причины ключевых решений. Не заменяет юридическое заключение.
      </AppText>

      <View style={styles.timeline}>
        {entries.map((e, idx) => (
          <View key={e.id} style={styles.row}>
            <View style={styles.railColumn}>
              <View style={styles.dot} />
              {idx < entries.length - 1 ? <View style={styles.rail} /> : null}
            </View>
            <Card style={styles.entryCard}>
              <View style={styles.entryTop}>
                <AppText variant="sectionLabel" style={styles.entryDate}>
                  {e.date}
                </AppText>
                <Badge label="Решение" tone="primary" />
              </View>
              <AppText variant="subtitle" style={styles.entryDecision}>
                {e.decision}
              </AppText>

              <View style={styles.entrySection}>
                <AppText variant="sectionLabel" style={styles.entrySectionLabel}>
                  Основание
                </AppText>
                <AppText variant="body" style={styles.entryBody}>
                  {e.rationale}
                </AppText>
              </View>

              <View style={styles.entryFooter}>
                <View style={styles.footerCol}>
                  <AppText variant="sectionLabel" style={styles.entrySectionLabel}>
                    Автор
                  </AppText>
                  <AppText variant="body" style={styles.footerValue}>
                    {e.author}
                  </AppText>
                </View>
                <View style={styles.footerCol}>
                  <AppText variant="sectionLabel" style={styles.entrySectionLabel}>
                    Что изменилось
                  </AppText>
                  <AppText variant="body" style={styles.footerValue}>
                    {e.whatChanged}
                  </AppText>
                </View>
              </View>
            </Card>
          </View>
        ))}
      </View>
    </Screen>
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
  timeline: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  railColumn: {
    width: 18,
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.background,
  },
  rail: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  entryCard: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  entryDate: {
    color: colors.gold,
    fontVariant: ['tabular-nums'],
  },
  entryDecision: {
    marginTop: spacing.sm,
    color: colors.textStrong,
  },
  entrySection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  entrySectionLabel: {
    marginBottom: 2,
    color: colors.muted,
  },
  entryBody: {
    color: colors.textStrong,
  },
  entryFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  footerCol: {
    flexGrow: 1,
    minWidth: 140,
  },
  footerValue: {
    marginTop: 2,
  },
});
