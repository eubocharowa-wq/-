import { useMemo } from 'react';
import { View, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/ui/Screen';
import { Card } from '../components/ui/Card';
import { AppText } from '../components/ui/AppText';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { colors, elevation, radii, spacing } from '../constants/theme';
import { useObjectsStore } from '../store/useObjectsStore';
import { computeDashboard, computeUpcomingTasks } from '../store/dashboard';

type ActionAccent = 'primary' | 'secondary' | 'neutral';

type ActionProps = {
  title: string;
  description: string;
  cta: string;
  accent: ActionAccent;
  disabled?: boolean;
  onPress?: () => void;
};

type ActionItem = ActionProps & { key: string };

export default function HomeScreen() {
  const router = useRouter();
  const objects = useObjectsStore((s) => s.objects);
  const stats = useMemo(() => computeDashboard(objects), [objects]);
  const tasks = useMemo(() => computeUpcomingTasks(objects), [objects]);
  const visibleTasks = tasks.slice(0, 3);

  const handleExpertReview = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
        const go = window.confirm(
          'Раздел «Экспертный разбор» в разработке.\n\nПерейти к списку объектов?'
        );
        if (go) router.push('/objects');
      }
      return;
    }
    Alert.alert(
      'Экспертный разбор',
      'Раздел в разработке. Пока вы можете открыть список объектов и передать вопрос по карточке.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'К списку объектов', onPress: () => router.push('/objects') },
      ]
    );
  };

  const actions: ActionItem[] = [
    {
      key: 'check',
      title: 'Проверить объект перед покупкой',
      description:
        'Адрес, ссылка, цена, документы и главный вопрос — для первичного скрининга.',
      cta: 'Начать проверку',
      accent: 'primary',
      onPress: () => router.push('/objects/new'),
    },
    {
      key: 'add',
      title: 'Добавить объект в досье',
      description:
        'Создать карточку объекта: вводные, документы, риски и этапы проверки.',
      cta: 'Добавить объект',
      accent: 'secondary',
      onPress: () => router.push('/objects/new'),
    },
    {
      key: 'inwork',
      title: 'Посмотреть объекты в работе',
      description:
        'Открыть сохранённые объекты, статусы, риски и ближайшие задачи.',
      cta: 'Открыть список',
      accent: 'neutral',
      onPress: () => router.push('/objects'),
    },
    {
      key: 'expert',
      title: 'Передать на экспертный разбор',
      description:
        'Если не хватает данных, есть стоп-фактор или нужно решение до аванса.',
      cta: 'Оставить запрос',
      accent: 'secondary',
      onPress: handleExpertReview,
    },
    {
      key: 'compare',
      title: 'Сравнить варианты',
      description:
        'Сравнить несколько объектов не по картинке, а по рискам, срокам и сценарию.',
      cta: 'Скоро',
      accent: 'neutral',
      disabled: true,
    },
    {
      key: 'format',
      title: 'Выбрать формат инвестирования',
      description:
        'Новостройка, коммерция, земля, реконструкция или проект развития — под вашу задачу.',
      cta: 'Скоро',
      accent: 'neutral',
      disabled: true,
    },
  ];

  return (
    <Screen scroll>
      <Card variant="hero" style={styles.hero}>
        <AppText style={styles.heroTag}>Центр Бизнес Инвестиций</AppText>
        <AppText style={styles.heroTitle}>Кабинет инвестора в недвижимость</AppText>
        <AppText style={styles.heroSubtitle}>
          Проверяйте объекты и проекты до входа в сделку: документы, экономика,
          риски, этапы и решение.
        </AppText>
        <View style={styles.heroActions}>
          <Button
            title="Проверить объект"
            onPress={() => router.push('/objects/new')}
            size="md"
            variant="primary"
          />
          <Button
            title="Передать на экспертный разбор"
            onPress={handleExpertReview}
            size="md"
            variant="outline"
            style={styles.heroActionOutline}
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <AppText variant="sectionLabel">Что вы хотите сделать?</AppText>
        <AppText variant="title" style={styles.sectionTitle}>
          Выберите точку входа
        </AppText>
      </View>

      <View style={styles.actionsGrid}>
        {actions.map(({ key, ...action }) => (
          <ActionCard key={key} {...action} />
        ))}
      </View>

      <Card variant="accent" style={styles.newcomerCard}>
        <AppText variant="sectionLabel">
          Если вы только выбираете направление
        </AppText>
        <AppText variant="title" style={styles.newcomerTitle}>
          Начните с первичного скрининга
        </AppText>
        <AppText variant="body" style={styles.newcomerText}>
          Он покажет, каких данных не хватает, какие риски видны сразу и есть ли
          смысл углубляться в объект.
        </AppText>
        <View style={styles.newcomerActions}>
          <Button
            title="Начать с первичного скрининга"
            onPress={() => router.push('/objects/new')}
            size="lg"
            variant="primary"
          />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <AppText variant="sectionLabel">Рабочая сводка</AppText>
        <AppText variant="small" style={styles.sectionHint}>
          Короткий статус по текущим объектам. Подробности — на вкладках досье.
        </AppText>
      </View>

      <View style={styles.summaryGrid}>
        <MetricPill label="В работе" value={stats.inWork} tone="primary" />
        <MetricPill label="Требуют решения" value={stats.needsDecision} tone="warning" />
        <MetricPill label="Стоп-факторы" value={stats.withStopFactors} tone="danger" />
        <MetricPill label="На проверке" value={stats.underReview} tone="neutral" />
        <MetricPill label="Сделки в процессе" value={stats.dealsInProgress} tone="success" />
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.tasksHeaderRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="sectionLabel">Ближайшие задачи</AppText>
            <AppText variant="small" style={styles.sectionHint}>
              Этапы, где нужен контроль сроков, документов или решения.
            </AppText>
          </View>
          <Button
            title="Все объекты"
            onPress={() => router.push('/objects')}
            size="sm"
            variant="outline"
          />
        </View>
      </View>

      {visibleTasks.length === 0 ? (
        <Card>
          <AppText variant="muted">Нет задач с ближайшими дедлайнами.</AppText>
        </Card>
      ) : (
        visibleTasks.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => router.push(`/objects/${t.objectId}/deal`)}
            style={({ pressed }) => [styles.taskWrap, pressed && { opacity: 0.85 }]}
          >
            <Card>
              <View style={styles.taskTopRow}>
                <AppText variant="caption" style={styles.taskDate}>
                  {t.deadline}
                </AppText>
                <Badge
                  label={t.statusLabel}
                  tone={t.statusLabel === 'Блок' ? 'danger' : 'primary'}
                />
              </View>
              <AppText variant="bodyStrong" style={{ marginTop: spacing.sm }}>
                {t.stageTitle}
              </AppText>
              <AppText variant="small" style={{ marginTop: spacing.xs }}>
                {t.objectName}
              </AppText>
            </Card>
          </Pressable>
        ))
      )}

      <AppText variant="small" style={styles.disclaimer}>
        Приложение не гарантирует доходность. Оно помогает структурировать
        вводные, увидеть риски и подготовить объект к экспертной проверке.
      </AppText>
    </Screen>
  );
}

function ActionCard({
  title,
  description,
  cta,
  accent,
  disabled,
  onPress,
}: ActionProps) {
  const accentColor =
    accent === 'primary'
      ? colors.gold
      : accent === 'secondary'
        ? colors.primary
        : colors.border;

  const content = (
    <Card
      style={[
        styles.actionCard,
        accent === 'primary' && styles.actionCardPrimary,
        disabled && styles.actionCardDisabled,
      ]}
    >
      <View style={[styles.actionAccent, { backgroundColor: accentColor }]} />
      <View style={styles.actionBody}>
        <View style={styles.actionTopRow}>
          {accent === 'primary' ? (
            <Badge label="Рекомендуем" tone="warning" />
          ) : null}
          {disabled ? <Badge label="Скоро" tone="outline" /> : null}
        </View>
        <AppText variant="bodyStrong" style={styles.actionTitle}>
          {title}
        </AppText>
        <AppText variant="small" style={styles.actionDescription}>
          {description}
        </AppText>
        <View style={styles.actionCtaRow}>
          <AppText
            style={[
              styles.actionCta,
              {
                color: disabled
                  ? colors.mutedStrong
                  : accent === 'primary'
                    ? colors.gold
                    : colors.text,
              },
            ]}
          >
            {cta}
          </AppText>
          {!disabled ? (
            <AppText
              style={[
                styles.actionArrow,
                {
                  color:
                    accent === 'primary' ? colors.gold : colors.text,
                },
              ]}
            >
              →
            </AppText>
          ) : null}
        </View>
      </View>
    </Card>
  );

  if (disabled) {
    return <View style={styles.actionWrap}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.actionWrap, pressed && { opacity: 0.9 }]}
    >
      {content}
    </Pressable>
  );
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'primary' | 'warning' | 'danger' | 'neutral' | 'success';
}) {
  const accent =
    tone === 'danger'
      ? colors.danger
      : tone === 'warning'
        ? colors.gold
        : tone === 'success'
          ? colors.success
          : tone === 'neutral'
            ? colors.muted
            : colors.primary;

  return (
    <View style={styles.pill}>
      <View style={[styles.pillAccent, { backgroundColor: accent }]} />
      <View style={styles.pillBody}>
        <AppText style={[styles.pillValue, { color: accent }]}>{value}</AppText>
        <AppText variant="small" style={styles.pillLabel}>
          {label}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  heroTag: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: spacing.sm,
    color: colors.textStrong,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: spacing.md,
    color: 'rgba(244, 239, 230, 0.82)',
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  heroActionOutline: {
    borderColor: 'rgba(215, 177, 95, 0.6)',
  },
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.xs,
    color: colors.textStrong,
  },
  sectionHint: {
    marginTop: spacing.xs,
    color: colors.muted,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionWrap: {
    flexGrow: 1,
    flexBasis: 280,
    minWidth: 240,
    borderRadius: radii.lg,
  },
  actionCard: {
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 180,
    ...elevation.card,
  },
  actionCardPrimary: {
    borderColor: colors.borderAccent,
  },
  actionCardDisabled: {
    opacity: 0.55,
  },
  actionAccent: {
    width: 4,
  },
  actionBody: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actionTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    minHeight: 4,
  },
  actionTitle: {
    color: colors.textStrong,
    fontSize: 17,
    lineHeight: 22,
  },
  actionDescription: {
    color: colors.muted,
    lineHeight: 18,
  },
  actionCtaRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  actionCta: {
    fontWeight: '700',
    letterSpacing: 0.4,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  actionArrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  newcomerCard: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  newcomerTitle: {
    marginTop: spacing.xs,
    color: colors.textStrong,
  },
  newcomerText: {
    marginTop: spacing.xs,
  },
  newcomerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  pill: {
    flexGrow: 1,
    flexBasis: 140,
    minWidth: 130,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...elevation.card,
  },
  pillAccent: {
    width: 3,
  },
  pillBody: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  pillValue: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  pillLabel: {
    marginTop: 2,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    fontSize: 10,
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskWrap: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  taskDate: {
    color: colors.gold,
    fontVariant: ['tabular-nums'],
  },
  disclaimer: {
    marginTop: spacing.xl,
    color: colors.muted,
    lineHeight: 18,
  },
});
