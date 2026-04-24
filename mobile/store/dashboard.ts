import type { InvestmentObject } from '../types/models';

export interface DashboardStats {
  /** Объекты в активной работе (не «Остановлен» и не «Пауза»). */
  inWork: number;
  /** Статус конвейера «Требует решения». */
  needsDecision: number;
  /** Объекты с отмеченными стоп-факторами (флаг данных). */
  withStopFactors: number;
  /** Статус конвейера «На проверке». */
  underReview: number;
  /** Статус конвейера «Сделка в процессе». */
  dealsInProgress: number;
}

export interface UpcomingTask {
  id: string;
  objectId: string;
  objectName: string;
  stageTitle: string;
  deadline: string;
  statusLabel: string;
}

function isActivePipeline(status: InvestmentObject['pipelineStatus']) {
  return status !== 'stopped' && status !== 'on_hold';
}

/**
 * Правила метрик главной (MVP):
 * - «В работе»: все объекты, кроме паузы и остановки.
 * - «Требует решения» / «На проверке» / «Сделка в процессе»: по полю pipelineStatus.
 * - «Стоп-факторы»: по флагу hasStopFactors (синхронизируется с блоком рисков в моках).
 */
export function computeDashboard(objects: InvestmentObject[]): DashboardStats {
  return {
    inWork: objects.filter((o) => isActivePipeline(o.pipelineStatus)).length,
    needsDecision: objects.filter((o) => o.pipelineStatus === 'needs_decision').length,
    withStopFactors: objects.filter((o) => o.hasStopFactors).length,
    underReview: objects.filter((o) => o.pipelineStatus === 'under_review').length,
    dealsInProgress: objects.filter((o) => o.pipelineStatus === 'deal_in_progress').length,
  };
}

export function computeUpcomingTasks(objects: InvestmentObject[], limit = 6): UpcomingTask[] {
  const rows: UpcomingTask[] = [];
  for (const o of objects) {
    for (const st of o.dealStages) {
      if (st.status === 'done') continue;
      if (!st.deadline) continue;
      rows.push({
        id: `${o.id}-${st.key}`,
        objectId: o.id,
        objectName: o.name,
        stageTitle: st.title,
        deadline: st.deadline,
        statusLabel:
          st.status === 'in_progress'
            ? 'В работе'
            : st.status === 'blocked'
              ? 'Блок'
              : 'Ожидает',
      });
    }
  }
  rows.sort((a, b) => a.deadline.localeCompare(b.deadline));
  return rows.slice(0, limit);
}
