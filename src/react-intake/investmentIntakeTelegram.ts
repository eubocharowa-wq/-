import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";
import { ROUTES } from "./investmentIntakeConfig";
import type { Checklist } from "./investmentIntakeChecklist";

const TG_USERNAME = "CENTR_BIZNES_INVEST";

function safeCopyToClipboard(text: string) {
  try {
    const maybe = navigator?.clipboard?.writeText?.(text);
    if (maybe && typeof (maybe as Promise<void>).then === "function") {
      (maybe as Promise<void>).catch(() => {});
    }
  } catch {
    // ignore: clipboard недоступен (http, permissions, iframe и т.д.)
  }
}

export function buildIntakeTelegramText(
  ctaLabel: string,
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): string {
  const route = ROUTES[routeId];
  const summary = buildRequestSummary(answers);
  const reality = buyingReality(answers.asset);
  const collect = checklist.collect.map((s) => `• ${s}`).join("\n");
  const verify = checklist.verify.map((s) => `• ${s}`).join("\n");

  return [
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
}

export function openTelegramWithIntakeText(
  ctaLabel: string,
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
) {
  const text = buildIntakeTelegramText(ctaLabel, answers, routeId, checklist);
  safeCopyToClipboard(text);

  const chatUrl = `https://t.me/${TG_USERNAME}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(chatUrl)}&text=${encodeURIComponent(text)}`;

  // Популярная причина «не открывается»: popup blocker. Открываем через временный <a>,
  // чтобы событие считалось пользовательским, плюс fallback на window.open / location.
  let opened = false;
  try {
    const a = document.createElement("a");
    a.href = shareUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    opened = true;
  } catch {
    opened = false;
  }

  if (!opened) {
    const w = window.open(shareUrl, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = shareUrl;
  }
}
