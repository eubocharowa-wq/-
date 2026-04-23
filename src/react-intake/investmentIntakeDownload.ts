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

function formatDateHuman(d = new Date()): string {
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
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

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphize(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br/>");
}

export function buildChecklistDocHtml(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): string {
  const route = ROUTES[routeId];
  const created = formatDateHuman();

  const collectItems = checklist.collect
    .map((item) => `<li style="margin: 0 0 6pt 0;">☐ ${escapeHtml(item)}</li>`)
    .join("");
  const verifyItems = checklist.verify
    .map((item) => `<li style="margin: 0 0 6pt 0;">☐ ${escapeHtml(item)}</li>`)
    .join("");

  // Word-совместимый HTML. Microsoft Word и LibreOffice Writer корректно открывают
  // такой документ, сохранённый с расширением .doc и MIME application/msword.
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>Инвестиционный запрос — ЦБИ</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page WordSection1 { size: 595.3pt 841.9pt; margin: 56pt 56pt 56pt 56pt; }
  div.WordSection1 { page: WordSection1; }
  body { font-family: 'Calibri', 'Helvetica', 'Arial', sans-serif; color: #1a1a1a; font-size: 11pt; line-height: 1.45; }
  h1 { font-size: 22pt; margin: 0 0 4pt 0; color: #111111; letter-spacing: -0.01em; }
  h2 { font-size: 14pt; margin: 22pt 0 6pt 0; color: #0f0f0f; border-bottom: 1pt solid #cfc29c; padding-bottom: 3pt; }
  h3 { font-size: 12pt; margin: 14pt 0 4pt 0; color: #2a2a2a; }
  p  { margin: 0 0 8pt 0; }
  ul { margin: 0 0 10pt 18pt; padding: 0; }
  li { margin: 0 0 6pt 0; }
  .eyebrow { font-size: 9pt; letter-spacing: 0.14em; text-transform: uppercase; color: #8a6d1e; font-weight: bold; }
  .meta { color: #555; font-size: 10pt; margin: 0 0 14pt 0; }
  .route { background: #faf5e7; border: 1pt solid #e6d39a; padding: 10pt 12pt; }
  .next  { background: #111111; color: #f5e9c3; padding: 10pt 12pt; }
  .next p { color: #f5e9c3; margin: 0; }
  .footer { margin-top: 26pt; padding-top: 10pt; border-top: 1pt solid #ddd; font-size: 9pt; color: #666; }
</style>
</head>
<body>
<div class="WordSection1">
  <p class="eyebrow">ЦБИ · Центр Бизнес-Инвестиций</p>
  <h1>Ваш инвестиционный запрос</h1>
  <p class="meta">Сформировано: ${escapeHtml(created)}</p>

  <h2>Собранный запрос</h2>
  <p>${paragraphize(buildRequestSummary(answers) || "—")}</p>

  <h2>Что вы покупаете на самом деле</h2>
  <p>${paragraphize(buyingReality(answers.asset))}</p>

  <h2>Маршрут: ${escapeHtml(route.title)}</h2>
  <div class="route"><p>${paragraphize(route.description)}</p></div>

  <h2>Персональный чек-лист</h2>

  <h3>Что собрать</h3>
  <ul>${collectItems}</ul>

  <h3>Что проверить</h3>
  <ul>${verifyItems}</ul>

  <h2>Следующий сильный шаг</h2>
  <div class="next"><p>${paragraphize(route.nextStep)}</p></div>

  <div class="footer">
    ЦБИ — экспертный центр отбора инвестиционных решений в недвижимости. Документ сформирован автоматически
    на основании ваших ответов и предназначен для внутренней подготовки. Не является офертой и не заменяет
    юридическую, налоговую или инвестиционную консультацию.
  </div>
</div>
</body>
</html>`;
}

export function downloadChecklistFile(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): void {
  const html = buildChecklistDocHtml(answers, routeId, checklist);
  const filename = `cbi-checklist-${slugAsset(answers.asset)}-${formatDateYYYYMMDD()}.doc`;
  // BOM + application/msword = Word/Pages/LibreOffice корректно откроют файл как документ.
  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
