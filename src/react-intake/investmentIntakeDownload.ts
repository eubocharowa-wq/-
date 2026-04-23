import type { IntakeAnswers, RouteId } from "./investmentIntakeConfig";
import { ROUTES } from "./investmentIntakeConfig";
import type { Checklist } from "./investmentIntakeChecklist";
import { buildRequestSummary, buyingReality } from "./investmentIntakeCopy";

/*
 * Генерация .docx без внешних зависимостей.
 * Собираем минимальный пакет OOXML:
 *   - [Content_Types].xml
 *   - _rels/.rels
 *   - word/document.xml
 *   - word/_rels/document.xml.rels
 * И запаковываем в ZIP (stored, без компрессии) с корректным CRC32.
 * Такой .docx корректно открывают: МойОфис, Microsoft Word, Pages, Google Docs, LibreOffice.
 */

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

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ------------------------- OOXML helpers ------------------------- */

type RunStyle = {
  bold?: boolean;
  italic?: boolean;
  sizeHalfPt?: number; // half-points: 22 => 11pt, 40 => 20pt
  color?: string;      // RRGGBB
};

type ParStyle = {
  spaceBefore?: number; // twentieths of a point (twips)
  spaceAfter?: number;
  indentLeft?: number;  // twips
  indentHanging?: number;
};

function runXml(text: string, s: RunStyle = {}): string {
  const rPr: string[] = [];
  if (s.bold) rPr.push("<w:b/><w:bCs/>");
  if (s.italic) rPr.push("<w:i/><w:iCs/>");
  if (s.sizeHalfPt) rPr.push(`<w:sz w:val="${s.sizeHalfPt}"/><w:szCs w:val="${s.sizeHalfPt}"/>`);
  if (s.color) rPr.push(`<w:color w:val="${s.color}"/>`);
  const rPrXml = rPr.length ? `<w:rPr>${rPr.join("")}</w:rPr>` : "";
  // xml:space="preserve" — обязательно, иначе пробелы и переносы исчезнут
  return `<w:r>${rPrXml}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
}

function paragraphXml(runs: string, p: ParStyle = {}): string {
  const pPr: string[] = [];
  const spacing: string[] = [];
  if (p.spaceBefore != null) spacing.push(`w:before="${p.spaceBefore}"`);
  if (p.spaceAfter != null) spacing.push(`w:after="${p.spaceAfter}"`);
  if (spacing.length) pPr.push(`<w:spacing ${spacing.join(" ")}/>`);
  if (p.indentLeft != null || p.indentHanging != null) {
    const parts: string[] = [];
    if (p.indentLeft != null) parts.push(`w:left="${p.indentLeft}"`);
    if (p.indentHanging != null) parts.push(`w:hanging="${p.indentHanging}"`);
    pPr.push(`<w:ind ${parts.join(" ")}/>`);
  }
  const pPrXml = pPr.length ? `<w:pPr>${pPr.join("")}</w:pPr>` : "";
  return `<w:p>${pPrXml}${runs}</w:p>`;
}

function simplePar(text: string, run: RunStyle = {}, par: ParStyle = { spaceAfter: 120 }): string {
  return paragraphXml(runXml(text, run), par);
}

function heading(level: 1 | 2 | 3, text: string): string {
  if (level === 1) return paragraphXml(runXml(text, { bold: true, sizeHalfPt: 40 }), { spaceBefore: 0, spaceAfter: 160 });
  if (level === 2) return paragraphXml(runXml(text, { bold: true, sizeHalfPt: 28, color: "1F1F1F" }), { spaceBefore: 320, spaceAfter: 120 });
  return paragraphXml(runXml(text, { bold: true, sizeHalfPt: 24, color: "2A2A2A" }), { spaceBefore: 200, spaceAfter: 80 });
}

function checklistItem(text: string): string {
  // Символ чек-бокса U+2610 ☐ + неразрывный пробел + текст
  const runs = runXml("☐\u00A0", { sizeHalfPt: 22 }) + runXml(text, { sizeHalfPt: 22 });
  return paragraphXml(runs, { spaceBefore: 40, spaceAfter: 80, indentLeft: 360, indentHanging: 280 });
}

function buildDocumentXml(answers: IntakeAnswers, routeId: RouteId, checklist: Checklist): string {
  const route = ROUTES[routeId];
  const created = formatDateHuman();
  const summary = buildRequestSummary(answers) || "—";
  const reality = buyingReality(answers.asset);

  const bodyParts: string[] = [
    simplePar("ЦБИ · Центр Бизнес-Инвестиций", { bold: true, sizeHalfPt: 18, color: "8A6D1E" }, { spaceBefore: 0, spaceAfter: 60 }),
    paragraphXml(runXml("Ваш инвестиционный запрос", { bold: true, sizeHalfPt: 44, color: "111111" }), { spaceBefore: 0, spaceAfter: 120 }),
    simplePar(`Сформировано: ${created}`, { italic: true, sizeHalfPt: 20, color: "666666" }, { spaceBefore: 0, spaceAfter: 320 }),

    heading(2, "Собранный запрос"),
    simplePar(summary),

    heading(2, "Что вы покупаете на самом деле"),
    simplePar(reality),

    heading(2, `Маршрут: ${route.title}`),
    simplePar(route.description),

    heading(2, "Персональный чек-лист"),
    heading(3, "Что собрать"),
    ...checklist.collect.map((i) => checklistItem(i)),
    heading(3, "Что проверить"),
    ...checklist.verify.map((i) => checklistItem(i)),

    heading(2, "Следующий сильный шаг"),
    simplePar(route.nextStep, { bold: true }),

    simplePar(
      "ЦБИ — экспертный центр отбора инвестиционных решений в недвижимости. Документ сформирован автоматически на основании ваших ответов. Не является офертой и не заменяет юридическую, налоговую или инвестиционную консультацию.",
      { italic: true, sizeHalfPt: 18, color: "666666" },
      { spaceBefore: 400, spaceAfter: 0 }
    ),
  ];

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
    `<w:body>` +
    bodyParts.join("") +
    `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>` +
    `</w:body></w:document>`
  );
}

const CONTENT_TYPES_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
  `<Default Extension="xml" ContentType="application/xml"/>` +
  `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
  `</Types>`;

const ROOT_RELS_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
  `</Relationships>`;

const DOC_RELS_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

/* ------------------------- ZIP writer (stored, no compression) ------------------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type ZipEntry = { name: string; data: Uint8Array; crc: number };

function buildZip(entries: { name: string; content: string }[]): Uint8Array {
  const textEncoder = new TextEncoder();
  const prepared: (ZipEntry & { nameBytes: Uint8Array; localOffset: number })[] = [];
  const localParts: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const data = textEncoder.encode(e.content);
    const nameBytes = textEncoder.encode(e.name);
    const crc = crc32(data);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(localHeader.buffer);
    dv.setUint32(0, 0x04034b50, true);  // local file header signature
    dv.setUint16(4, 20, true);          // version needed
    dv.setUint16(6, 0x0800, true);      // flags (bit 11 = UTF-8 filename)
    dv.setUint16(8, 0, true);           // method = 0 (stored)
    dv.setUint16(10, 0, true);          // mod time
    dv.setUint16(12, 0x21, true);       // mod date (01.01.1980)
    dv.setUint32(14, crc, true);
    dv.setUint32(18, data.length, true); // compressed size
    dv.setUint32(22, data.length, true); // uncompressed size
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);          // extra length
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, data);
    prepared.push({ name: e.name, data, crc, nameBytes, localOffset: offset });
    offset += localHeader.length + data.length;
  }

  const centralParts: Uint8Array[] = [];
  let centralSize = 0;
  for (const p of prepared) {
    const header = new Uint8Array(46 + p.nameBytes.length);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x02014b50, true);  // central dir signature
    dv.setUint16(4, 20, true);          // version made by
    dv.setUint16(6, 20, true);          // version needed
    dv.setUint16(8, 0x0800, true);      // flags
    dv.setUint16(10, 0, true);          // method
    dv.setUint16(12, 0, true);          // mod time
    dv.setUint16(14, 0x21, true);       // mod date
    dv.setUint32(16, p.crc, true);
    dv.setUint32(20, p.data.length, true);
    dv.setUint32(24, p.data.length, true);
    dv.setUint16(28, p.nameBytes.length, true);
    dv.setUint16(30, 0, true);          // extra length
    dv.setUint16(32, 0, true);          // comment length
    dv.setUint16(34, 0, true);          // disk number start
    dv.setUint16(36, 0, true);          // internal attrs
    dv.setUint32(38, 0, true);          // external attrs
    dv.setUint32(42, p.localOffset, true);
    header.set(p.nameBytes, 46);
    centralParts.push(header);
    centralSize += header.length;
  }

  const eocd = new Uint8Array(22);
  const dv = new DataView(eocd.buffer);
  dv.setUint32(0, 0x06054b50, true);    // EOCD signature
  dv.setUint16(4, 0, true);             // this disk
  dv.setUint16(6, 0, true);             // disk where CD starts
  dv.setUint16(8, prepared.length, true); // CD records on this disk
  dv.setUint16(10, prepared.length, true); // CD records total
  dv.setUint32(12, centralSize, true);  // CD size
  dv.setUint32(16, offset, true);       // CD offset
  dv.setUint16(20, 0, true);            // comment length

  let totalLength = offset + centralSize + eocd.length;
  const output = new Uint8Array(totalLength);
  let pos = 0;
  for (const part of localParts) { output.set(part, pos); pos += part.length; }
  for (const part of centralParts) { output.set(part, pos); pos += part.length; }
  output.set(eocd, pos);
  return output;
}

/* ------------------------- public API ------------------------- */

export function buildChecklistDocx(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): Uint8Array {
  const documentXml = buildDocumentXml(answers, routeId, checklist);
  return buildZip([
    { name: "[Content_Types].xml", content: CONTENT_TYPES_XML },
    { name: "_rels/.rels", content: ROOT_RELS_XML },
    { name: "word/_rels/document.xml.rels", content: DOC_RELS_XML },
    { name: "word/document.xml", content: documentXml },
  ]);
}

export function downloadChecklistFile(
  answers: IntakeAnswers,
  routeId: RouteId,
  checklist: Checklist
): void {
  const bytes = buildChecklistDocx(answers, routeId, checklist);
  const filename = `cbi-checklist-${slugAsset(answers.asset)}-${formatDateYYYYMMDD()}.docx`;
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
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
