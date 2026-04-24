export type AssetType = 'commercial_tenant' | 'land_development' | 'newbuild_investment';

export type ObjectPipelineStatus =
  | 'in_work'
  | 'needs_decision'
  | 'under_review'
  | 'deal_in_progress'
  | 'on_hold'
  | 'stopped';

export type RiskLevel = 'low' | 'medium' | 'high' | 'elevated';

export type DocumentStatus =
  | 'received'
  | 'requested'
  | 'under_review'
  | 'has_remarks'
  | 'not_provided';

export type RiskCategory =
  | 'legal'
  | 'land'
  | 'urban'
  | 'technical'
  | 'infrastructure'
  | 'financial'
  | 'market'
  | 'operational';

export type RiskBucket = 'stop' | 'mitigated_by_check' | 'priced_in' | 'consciously_accepted';

export type DealStageStatus = 'pending' | 'in_progress' | 'blocked' | 'done';

export type EconomyScenarioKind = 'base' | 'cautious' | 'stress';

export interface SourceDataField {
  id: string;
  label: string;
  value: string;
  note?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  status: DocumentStatus;
}

export interface EconomyScenario {
  kind: EconomyScenarioKind;
  entryPriceLabel: string;
  additionalCostsLabel: string;
  realizationHorizonLabel: string;
  reserveLabel: string;
  sensitivityFactor: string;
  conclusion: string;
}

export interface RiskItem {
  id: string;
  category: RiskCategory;
  bucket: RiskBucket;
  severity: RiskLevel;
  title: string;
  description: string;
  whatToVerify: string;
  canBeMitigated: boolean;
  affectsDecision: boolean;
}

export interface DealStage {
  order: number;
  key: string;
  title: string;
  status: DealStageStatus;
  deadline?: string;
  owner?: string;
  transitionBlocker?: string;
}

export interface DecisionLogEntry {
  id: string;
  date: string;
  decision: string;
  rationale: string;
  author: string;
  whatChanged: string;
}

export interface InvestmentObject {
  id: string;
  name: string;
  address: string;
  assetType: AssetType;
  region: string;
  entryPriceLabel: string;
  scenarioLabel: string;
  pipelineStatus: ObjectPipelineStatus;
  riskLevel: RiskLevel;
  shortConclusion: string;
  investmentThesis: string;
  todaySummary: string;
  sourceData: SourceDataField[];
  documents: DocumentItem[];
  economyScenarios: EconomyScenario[];
  risks: RiskItem[];
  dealStages: DealStage[];
  decisionLog: DecisionLogEntry[];
  /** Явный флаг стоп-факторов для метрик главной (дублирует логику по bucket === 'stop'). */
  hasStopFactors: boolean;
}

export interface CreateObjectInput {
  name: string;
  assetType: AssetType;
  region: string;
  entryPriceLabel: string;
  scenarioLabel: string;
  pipelineStatus: ObjectPipelineStatus;
  riskLevel: RiskLevel;
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  commercial_tenant: 'Коммерция с арендатором',
  land_development: 'Земля под развитие',
  newbuild_investment: 'Новостройка (инвест. сценарий)',
};

export const PIPELINE_STATUS_LABELS: Record<ObjectPipelineStatus, string> = {
  in_work: 'В работе',
  needs_decision: 'Требует решения',
  under_review: 'На проверке',
  deal_in_progress: 'Сделка в процессе',
  on_hold: 'Пауза',
  stopped: 'Остановлен',
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Низкий',
  medium: 'Умеренный',
  high: 'Повышенный',
  elevated: 'Высокий',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  received: 'Получен',
  requested: 'Запрошен',
  under_review: 'На проверке',
  has_remarks: 'Есть замечания',
  not_provided: 'Не предоставлен',
};

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  legal: 'Правовой',
  land: 'Земельный',
  urban: 'Градостроительный',
  technical: 'Технический',
  infrastructure: 'Инфраструктурный',
  financial: 'Финансовый',
  market: 'Рыночный',
  operational: 'Операционный',
};

export const RISK_BUCKET_LABELS: Record<RiskBucket, string> = {
  stop: 'Стоп-факторы',
  mitigated_by_check: 'Снимаемые проверкой',
  priced_in: 'Закладываемые в цену',
  consciously_accepted: 'Принимаемые осознанно',
};

export const ECONOMY_SCENARIO_LABELS: Record<EconomyScenarioKind, string> = {
  base: 'Базовый расчётный сценарий',
  cautious: 'Осторожный сценарий',
  stress: 'Стресс-сценарий',
};
