import type {
  CreateObjectInput,
  DealStage,
  EconomyScenario,
  InvestmentObject,
} from '../types/models';

const DEFAULT_DEAL_STAGES = (): DealStage[] => [
  { order: 1, key: 'contact', title: 'Первичный контакт', status: 'in_progress', transitionBlocker: '—' },
  { order: 2, key: 'data', title: 'Сбор данных', status: 'pending' },
  { order: 3, key: 'screen', title: 'Первичный скрининг', status: 'pending' },
  { order: 4, key: 'deep', title: 'Углублённая проверка', status: 'pending' },
  { order: 5, key: 'negotiation', title: 'Переговоры', status: 'pending' },
  { order: 6, key: 'structure', title: 'Проект сделки', status: 'pending' },
  { order: 7, key: 'deposit', title: 'Предоплата / резерв', status: 'pending' },
  { order: 8, key: 'closing', title: 'Закрытие', status: 'pending' },
  { order: 9, key: 'registration', title: 'Регистрация / передача', status: 'pending' },
  { order: 10, key: 'post', title: 'Постсделка', status: 'pending' },
];

const PLACEHOLDER_ECONOMY = (entry: string): EconomyScenario[] => [
  {
    kind: 'base',
    entryPriceLabel: entry,
    additionalCostsLabel: 'Требует оценки после сбора вводных',
    realizationHorizonLabel: '—',
    reserveLabel: '—',
    sensitivityFactor: 'Будет определён после проверки исходных данных',
    conclusion: 'Расчётный сценарий не сформирован: недостаточно вводных. Это не оценка доходности.',
  },
  {
    kind: 'cautious',
    entryPriceLabel: entry,
    additionalCostsLabel: 'Требует оценки',
    realizationHorizonLabel: '—',
    reserveLabel: '—',
    sensitivityFactor: 'Требует проверки',
    conclusion: 'Осторожный сценарий будет заполнен после углублённой проверки.',
  },
  {
    kind: 'stress',
    entryPriceLabel: entry,
    additionalCostsLabel: 'Требует оценки',
    realizationHorizonLabel: '—',
    reserveLabel: '—',
    sensitivityFactor: 'Требует проверки',
    conclusion: 'Стресс-сценарий используется для проверки устойчивости модели при заданных вводных (когда они появятся).',
  },
];

export function createSkeletonObject(input: CreateObjectInput): InvestmentObject {
  return {
    id: `obj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name,
    address: 'Адрес уточняется после выезда и сверки с документами',
    assetType: input.assetType,
    region: input.region,
    entryPriceLabel: input.entryPriceLabel,
    scenarioLabel: input.scenarioLabel,
    pipelineStatus: input.pipelineStatus,
    riskLevel: input.riskLevel,
    shortConclusion: 'Объект создан. Данные появятся после сбора вводных.',
    investmentThesis: 'Инвестиционный тезис будет сформирован после первичного скрининга.',
    todaySummary: 'Старт проверки: зафиксируйте исходные данные и запросите базовый пакет документов.',
    sourceData: [],
    documents: [],
    economyScenarios: PLACEHOLDER_ECONOMY(input.entryPriceLabel),
    risks: [],
    dealStages: DEFAULT_DEAL_STAGES(),
    decisionLog: [],
    hasStopFactors: false,
  };
}
