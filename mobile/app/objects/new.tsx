import { useState } from 'react';
import { TextInput, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/ui/Screen';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { AssetType, ObjectPipelineStatus, RiskLevel } from '../../types/models';
import { ASSET_TYPE_LABELS, PIPELINE_STATUS_LABELS, RISK_LEVEL_LABELS } from '../../types/models';
import { colors, radii, spacing } from '../../constants/theme';
import { useObjectsStore } from '../../store/useObjectsStore';

const ASSET_TYPES: AssetType[] = ['commercial_tenant', 'land_development', 'newbuild_investment'];
const STATUSES: ObjectPipelineStatus[] = ['in_work', 'needs_decision', 'under_review', 'deal_in_progress'];
const RISKS: RiskLevel[] = ['low', 'medium', 'high', 'elevated'];

export default function NewObjectScreen() {
  const router = useRouter();
  const addObject = useObjectsStore((s) => s.addObject);

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [entry, setEntry] = useState('');
  const [scenario, setScenario] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('commercial_tenant');
  const [pipelineStatus, setPipelineStatus] = useState<ObjectPipelineStatus>('in_work');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');

  const onSave = () => {
    const id = addObject({
      name: name.trim() || 'Новый объект без названия',
      assetType,
      region: region.trim() || 'Регион уточняется',
      entryPriceLabel: entry.trim() || '—',
      scenarioLabel: scenario.trim() || 'Сценарий уточняется',
      pipelineStatus,
      riskLevel,
    });
    router.replace(`/objects/${id}/overview`);
  };

  return (
    <Screen scroll>
      <AppText variant="sectionLabel">Новый объект</AppText>
      <AppText variant="display" style={styles.title}>
        Добавить объект в работу
      </AppText>
      <AppText variant="muted" style={styles.subtitle}>
        Базовая карточка создаётся локально. Документы, экономику и риски можно дозаполнить на отдельных вкладках.
      </AppText>

      <Card style={styles.section}>
        <Field label="Название объекта" required>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Рабочее название объекта"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>

        <Field label="Регион или город">
          <TextInput
            value={region}
            onChangeText={setRegion}
            placeholder="Например: Москва, ЦАО"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>

        <Field label="Ориентир по цене входа">
          <TextInput
            value={entry}
            onChangeText={setEntry}
            placeholder="Например: 25 млн ₽, предварительно"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
        </Field>

        <Field label="Сценарий входа">
          <TextInput
            value={scenario}
            onChangeText={setScenario}
            placeholder="Коротко: логика входа и выхода"
            placeholderTextColor={colors.muted}
            style={[styles.input, { minHeight: 84, textAlignVertical: 'top' }]}
            multiline
          />
        </Field>
      </Card>

      <AppText variant="sectionLabel" style={styles.chipGroupLabel}>
        Тип актива
      </AppText>
      <View style={styles.chipsWrap}>
        {ASSET_TYPES.map((t) => (
          <ChoiceChip key={t} label={ASSET_TYPE_LABELS[t]} selected={assetType === t} onPress={() => setAssetType(t)} />
        ))}
      </View>

      <AppText variant="sectionLabel" style={styles.chipGroupLabel}>
        Этап воронки
      </AppText>
      <View style={styles.chipsWrap}>
        {STATUSES.map((t) => (
          <ChoiceChip
            key={t}
            label={PIPELINE_STATUS_LABELS[t]}
            selected={pipelineStatus === t}
            onPress={() => setPipelineStatus(t)}
          />
        ))}
      </View>

      <AppText variant="sectionLabel" style={styles.chipGroupLabel}>
        Уровень риска
      </AppText>
      <View style={styles.chipsWrap}>
        {RISKS.map((t) => (
          <ChoiceChip key={t} label={RISK_LEVEL_LABELS[t]} selected={riskLevel === t} onPress={() => setRiskLevel(t)} />
        ))}
      </View>

      <Card variant="flat" style={styles.warning}>
        <AppText variant="small" style={{ color: colors.muted }}>
          Формулировки носят предварительный характер и требуют проверки исходных данных. Приложение не гарантирует доходность.
        </AppText>
      </Card>

      <Button title="Создать объект" size="lg" fullWidth onPress={onSave} style={styles.cta} />
      <Button title="Отмена" variant="ghost" fullWidth style={styles.cancel} onPress={() => router.back()} />
    </Screen>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <AppText variant="sectionLabel">{label}</AppText>
        {required ? <AppText style={styles.required}>обязательно</AppText> : null}
      </View>
      {children}
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipOn : styles.chipOff,
        pressed && { opacity: 0.9 },
      ]}
    >
      <AppText
        style={{
          color: selected ? '#1A150C' : colors.gold,
          fontWeight: '700',
          fontSize: 13,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  required: {
    fontSize: 10,
    color: colors.goldBright,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.textStrong,
    fontSize: 15,
  },
  chipGroupLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  chipOn: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  chipOff: {
    backgroundColor: 'transparent',
    borderColor: colors.borderAccent,
  },
  warning: {
    marginTop: spacing.md,
  },
  cta: {
    marginTop: spacing.xl,
  },
  cancel: {
    marginTop: spacing.sm,
  },
});
