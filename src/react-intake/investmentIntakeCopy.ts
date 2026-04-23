import type { IntakeAnswers } from "./investmentIntakeConfig";

export function buildRequestSummary(a: IntakeAnswers): string {
  const parts = [
    a.asset && `Рассматриваю: ${a.asset.toLowerCase()}.`,
    a.task && `Задача: ${a.task.toLowerCase()}.`,
    a.horizon && `Горизонт: ${a.horizon.toLowerCase()}.`,
    a.focus && `В приоритете: ${a.focus.toLowerCase()}.`,
    a.materials && `Сейчас по материалам: ${a.materials.toLowerCase()}.`,
    a.output && `На первом этапе нужно: ${a.output.toLowerCase()}.`,
  ].filter(Boolean);
  return parts.join(" ");
}

export function buyingReality(asset: string | null): string {
  switch (asset) {
    case "Коммерческую недвижимость":
      return "Вы покупаете не только помещение. Вы покупаете устойчивость аренды и запас прочности модели.";
    case "Земельный участок":
      return "Вы покупаете не только участок. Вы покупаете сценарий использования, ограничения и будущую реализуемость.";
    case "Новостройку":
      return "Вы покупаете не только лот. Вы покупаете будущий выход, конкуренцию и устойчивость сценария.";
    case "Проект развития":
      return "Вы покупаете не только идею. Вы покупаете управляемость этапов, ограничения и инвестиционную логику проекта.";
    case "Несколько вариантов":
      return "Вы покупаете не только «лучший вариант». Вы покупаете сопоставимую логику ограничений и сценариев — иначе сравнение теряет опору.";
    default:
      return "Вы покупаете не только актив. Вы покупаете набор ограничений, сценариев и управляемость риска до решения о капитале.";
  }
}
