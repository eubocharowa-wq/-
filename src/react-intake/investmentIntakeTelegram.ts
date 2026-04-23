import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";
import { ROUTES } from "./investmentIntakeConfig";
import type { Checklist } from "./investmentIntakeChecklist";

const TG_USERNAME = "CENTR_BIZNES_INVEST";

export type TelegramOpenResult = {
  opened: boolean;
  copied: boolean;
  chatUrl: string;
  text: string;
};

function tryCopyClipboardAsync(text: string): Promise<boolean> {
  try {
    const maybe = navigator?.clipboard?.writeText?.(text);
    if (maybe && typeof (maybe as Promise<void>).then === "function") {
      return (maybe as Promise<void>).then(() => true).catch(() => false);
    }
  } catch {
    // fall through
  }
  return Promise.resolve(false);
}

function copyViaTextareaFallback(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.left = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
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

/**
 * Открывает чат ЦБИ в Telegram и кладёт собранный текст в буфер обмена.
 * Используем прямую ссылку на чат (самый стабильный вариант: работает и на
 * десктопе, и на мобильных, в т.ч. без предварительного логина в Telegram Web).
 * `t.me/share/url` часто не срабатывает на iOS / при заблокированных popup'ах,
 * поэтому мы его не используем.
 */
export function openTelegramWithIntakeText(
  ctaLabel: string,
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): TelegramOpenResult {
  const text = buildIntakeTelegramText(ctaLabel, answers, routeId, checklist);
  const chatUrl = `https://t.me/${TG_USERNAME}`;

  // 1) Синхронный fallback-копир через textarea (работает без HTTPS/permissions).
  let copied = copyViaTextareaFallback(text);
  // 2) Параллельно пытаемся через современный clipboard API (если разрешён).
  void tryCopyClipboardAsync(text).then((ok) => {
    if (ok) copied = true;
  });

  // Открываем чат. Сначала window.open с _blank — это самый переносимый способ,
  // и вызов идёт строго из обработчика клика, поэтому popup blocker не мешает.
  let opened = false;
  try {
    const w = window.open(chatUrl, "_blank", "noopener,noreferrer");
    if (w) opened = true;
  } catch {
    opened = false;
  }

  // Доп. попытка через программный клик по <a> — покрывает edge-case'ы
  // в iframe / WebView-like средах.
  if (!opened) {
    try {
      const a = document.createElement("a");
      a.href = chatUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      opened = true;
    } catch {
      // проглатываем
    }
  }

  // Последний fallback: переход текущей вкладкой.
  if (!opened) {
    try {
      window.location.href = chatUrl;
      opened = true;
    } catch {
      opened = false;
    }
  }

  return { opened, copied, chatUrl, text };
}
