import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";
import { ROUTES } from "./investmentIntakeConfig";
import type { Checklist } from "./investmentIntakeChecklist";

const TG_USERNAME = "CENTR_BIZNES_INVEST";

export function openTelegramWithIntakeText(
  ctaLabel: string,
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
) {
  const route = ROUTES[routeId];
  const summary = buildRequestSummary(answers);
  const reality = buyingReality(answers.asset);
  const collect = checklist.collect.map((s) => `• ${s}`).join("\n");
  const verify = checklist.verify.map((s) => `• ${s}`).join("\n");

  const text = [
    "Здравствуйте. Инвестиционный запрос с главной страницы ЦБИ.",
    "",
    `Действие: ${ctaLabel}`,
    "",
    "— Собранный запрос —",
    summary,
    "",
    "— Что вы покупаете на самом деле —",
    reality,
    "",
    `— Маршрут: ${route.title} —`,
    route.description,
    "",
    "— Чек-лист: что собрать —",
    collect,
    "",
    "— Чек-лист: что проверить —",
    verify,
    "",
    "— Следующий шаг —",
    route.nextStep,
  ].join("\n");

  try {
    void navigator.clipboard?.writeText?.(text);
  } catch {
    // ignore
  }

  const chatUrl = `https://t.me/${TG_USERNAME}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(chatUrl)}&text=${encodeURIComponent(text)}`;
  const w = window.open(shareUrl, "_blank", "noopener,noreferrer");
  if (!w) window.location.href = shareUrl;
}
