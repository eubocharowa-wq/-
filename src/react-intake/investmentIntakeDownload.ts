import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { ROUTES } from "./investmentIntakeConfig";
import type { Checklist } from "./investmentIntakeChecklist";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";

function formatDateYYYYMMDD(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slugAsset(asset: string | null): string {
  if (!asset) return "obyekt";
  return asset
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/й/g, "i")
    .replace(/[^a-zа-я0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function buildChecklistMarkdown(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): string {
  const route = ROUTES[routeId];
  const lines: string[] = [];
  lines.push("# Ваш инвестиционный запрос — ЦБИ");
  lines.push("");
  lines.push(`_Сформировано: ${formatDateYYYYMMDD()}_`);
  lines.push("");
  lines.push("## Собранный запрос");
  lines.push(buildRequestSummary(answers) || "—");
  lines.push("");
  lines.push("## Что вы покупаете на самом деле");
  lines.push(buyingReality(answers.asset));
  lines.push("");
  lines.push(`## Маршрут: ${route.title}`);
  lines.push(route.description);
  lines.push("");
  lines.push("## Персональный чек-лист");
  lines.push("");
  lines.push("### Что собрать");
  checklist.collect.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push("");
  lines.push("### Что проверить");
  checklist.verify.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push("");
  lines.push("## Следующий сильный шаг");
  lines.push(route.nextStep);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("ЦБИ · Центр Бизнес-Инвестиций — экспертный центр отбора инвестиционных решений.");
  lines.push("Этот чек-лист не является офертой и не заменяет юридическую, налоговую или инвестиционную консультацию.");
  return lines.join("\n");
}

export function downloadChecklistFile(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): void {
  const md = buildChecklistMarkdown(answers, routeId, checklist);
  const filename = `cbi-checklist-${slugAsset(answers.asset)}-${formatDateYYYYMMDD()}.md`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
