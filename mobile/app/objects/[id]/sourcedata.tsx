import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { AppText } from '../../../components/ui/AppText';
import { colors, spacing } from '../../../constants/theme';
import { useObjectDetail } from '../../../hooks/useObjectDetail';

export default function ObjectSourceDataTab() {
  const { object } = useObjectDetail();

  if (!object) {
    return (
      <Screen scroll>
        <AppText variant="body">Объект не найден.</AppText>
      </Screen>
    );
  }

  if (object.sourceData.length === 0) {
    return (
      <Screen scroll>
        <Card variant="accent">
          <AppText variant="sectionLabel" style={{ marginBottom: spacing.sm }}>
            Вводные не заполнены
          </AppText>
          <AppText variant="bodyStrong">
            Данные появятся после сбора вводных по объекту.
          </AppText>
          <AppText variant="muted" style={{ marginTop: spacing.md }}>
            Зафиксируйте исходные параметры на выезде и по документам. Это не заменяет юридическую проверку.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="sectionLabel" style={styles.header}>
        Вводные по объекту
      </AppText>
      <AppText variant="muted" style={styles.subheader}>
        Исходные параметры объекта. Требуют сверки с первоисточниками.
      </AppText>

      {object.sourceData.map((row) => (
        <Card key={row.id} style={styles.card}>
          <AppText variant="sectionLabel">{row.label}</AppText>
          <AppText variant="bodyStrong" style={styles.value}>
            {row.value}
          </AppText>
          {row.note ? (
            <View style={styles.note}>
              <AppText variant="small">{row.note}</AppText>
            </View>
          ) : null}
        </Card>
      ))}
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
  card: {
    marginBottom: spacing.md,
  },
  value: {
    marginTop: spacing.xs,
    color: colors.textStrong,
  },
  note: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
