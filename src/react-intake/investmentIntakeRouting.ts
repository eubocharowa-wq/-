import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { ROUTES } from "./investmentIntakeConfig";

const URGENT_HORIZONS = new Set(["Сейчас", "До 2 недель"]);

function isStrongMaterials(m: string | null) {
  return (
    m === "Есть презентация и цена входа" ||
    m === "Есть документы" ||
    m === "Есть несколько материалов для сравнения"
  );
}

function wantsDealPrep(a: IntakeAnswers) {
  return a.task === "Подготовиться к сделке" || a.output === "Подготовиться к следующему шагу";
}

function wantsDeepFocus(a: IntakeAnswers) {
  return (
    a.focus === "Документы и ограничения" ||
    a.focus === "Логику проекта целиком" ||
    a.focus === "Слабое место модели"
  );
}

/** Смысловая маршрутизация без баллов. Приоритет: project > complex > focused > calm */
export function resolveRoute(a: IntakeAnswers): { id: RouteId } & (typeof ROUTES)[RouteId] {
  const { asset, materials, horizon } = a;
  const urgent = Boolean(horizon && URGENT_HORIZONS.has(horizon));

  if (asset === "Проект развития") {
    return { id: "project", ...ROUTES.project };
  }

  if (asset === "Земельный участок" || asset === "Коммерческая недвижимость") {
    return { id: "complex", ...ROUTES.complex };
  }

  const multi = asset === "Несколько вариантов";
  const compareTask = a.task === "Сравнить несколько сценариев";

  const focusedSignal =
    isStrongMaterials(materials) ||
    (multi && isStrongMaterials(materials)) ||
    (compareTask && isStrongMaterials(materials)) ||
    (wantsDealPrep(a) && isStrongMaterials(materials)) ||
    (urgent && isStrongMaterials(materials) && wantsDeepFocus(a));

  if (focusedSignal) {
    return { id: "focused", ...ROUTES.focused };
  }

  return { id: "calm", ...ROUTES.calm };
}
