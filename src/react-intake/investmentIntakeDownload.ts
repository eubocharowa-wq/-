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

/**
 * Кодирование строки в RTF: служебные символы экранируем, не-ASCII символы
 * переводим в формат Unicode-ESC `\uN?`, где N — signed int16.
 * Так RTF-читатель (Word / Pages / LibreOffice / Google Docs) корректно
 * отрисует кириллицу без выбора кодировки.
 */
function rtfEscape(input: string): string {
  let out = "";
  for (const ch of String(input)) {
    const code = ch.codePointAt(0) as number;
    if (ch === "\\") out += "\\\\";
    else if (ch === "{") out += "\\{";
    else if (ch === "}") out += "\\}";
    else if (ch === "\n") out += "\\line ";
    else if (ch === "\r") {
      // ignore — пара \r\n уже обработана через \n
    } else if (code < 128) {
      out += ch;
    } else {
      // RTF ожидает signed 16-bit; значения > 32767 передаются как отрицательные
      const signed = code > 32767 ? code - 65536 : code;
      out += `\\u${signed}?`;
    }
  }
  return out;
}

function rtfParagraph(text: string, opts: { fontSizeHalfPt?: number; bold?: boolean; italic?: boolean; spaceBeforeTwip?: number; spaceAfterTwip?: number } = {}): string {
  const size = opts.fontSizeHalfPt ?? 22; // 11pt
  const sb = opts.spaceBeforeTwip ?? 80;
  const sa = opts.spaceAfterTwip ?? 80;
  const bold = opts.bold ? "\\b " : "";
  const italic = opts.italic ? "\\i " : "";
  const boldEnd = opts.bold ? "\\b0" : "";
  const italicEnd = opts.italic ? "\\i0" : "";
  return `{\\pard\\sa${sa}\\sb${sb}\\fs${size} ${bold}${italic}${rtfEscape(text)}${italicEnd}${boldEnd}\\par}`;
}

function rtfH1(text: string): string {
  return `{\\pard\\sa120\\sb0\\fs40\\b ${rtfEscape(text)}\\b0\\par}`;
}

function rtfH2(text: string): string {
  return `{\\pard\\sa80\\sb240\\fs28\\b ${rtfEscape(text)}\\b0\\par}`;
}

function rtfH3(text: string): string {
  return `{\\pard\\sa60\\sb160\\fs24\\b ${rtfEscape(text)}\\b0\\par}`;
}

function rtfChecklistItems(items: string[]): string {
  // «☐» (U+2610) + неразрывный пробел + текст пункта
  return items
    .map((item) => `{\\pard\\sa60\\sb0\\fi-280\\li360\\fs22 \\u9744? ${rtfEscape(item)}\\par}`)
    .join("");
}

export function buildChecklistRtf(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): string {
  const route = ROUTES[routeId];
  const created = formatDateHuman();
  const summary = buildRequestSummary(answers) || "—";
  const reality = buyingReality(answers.asset);

  const header =
    "{\\rtf1\\ansi\\ansicpg1251\\deff0\\nouicompat" +
    "{\\fonttbl{\\f0\\fnil\\fcharset204 Calibri;}{\\f1\\fnil\\fcharset204 Helvetica;}}" +
    "{\\colortbl;\\red17\\green17\\blue17;\\red138\\green109\\blue30;\\red85\\green85\\blue85;}" +
    "\\viewkind4\\uc1\\f0";

  const body = [
    rtfParagraph("ЦБИ · Центр Бизнес-Инвестиций", { fontSizeHalfPt: 18, bold: true, spaceBeforeTwip: 0, spaceAfterTwip: 40 }),
    rtfH1("Ваш инвестиционный запрос"),
    rtfParagraph(`Сформировано: ${created}`, { fontSizeHalfPt: 20, italic: true, spaceBeforeTwip: 0, spaceAfterTwip: 240 }),

    rtfH2("Собранный запрос"),
    rtfParagraph(summary),

    rtfH2("Что вы покупаете на самом деле"),
    rtfParagraph(reality),

    rtfH2(`Маршрут: ${route.title}`),
    rtfParagraph(route.description),

    rtfH2("Персональный чек-лист"),
    rtfH3("Что собрать"),
    rtfChecklistItems([...checklist.collect]),
    rtfH3("Что проверить"),
    rtfChecklistItems([...checklist.verify]),

    rtfH2("Следующий сильный шаг"),
    rtfParagraph(route.nextStep, { bold: true }),

    rtfParagraph(
      "ЦБИ — экспертный центр отбора инвестиционных решений в недвижимости. Документ сформирован автоматически на основании ваших ответов. Не является офертой и не заменяет юридическую, налоговую или инвестиционную консультацию.",
      { fontSizeHalfPt: 18, italic: true, spaceBeforeTwip: 320, spaceAfterTwip: 0 }
    ),
  ].join("");

  return `${header}${body}}`;
}

export function downloadChecklistFile(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): void {
  const rtf = buildChecklistRtf(answers, routeId, checklist);
  const filename = `cbi-checklist-${slugAsset(answers.asset)}-${formatDateYYYYMMDD()}.doc`;
  // RTF открывается как документ в Word / Pages / LibreOffice / Google Docs.
  // Сохраняем с расширением .doc — Word определяет формат по сигнатуре содержимого
  // ({\rtf1...}) и открывает без проблем.
  const blob = new Blob([rtf], { type: "application/msword;charset=utf-8" });
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
