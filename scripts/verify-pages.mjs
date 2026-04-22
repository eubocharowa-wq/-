/**
 * Проверка каркаса многостраничности: файлы из src/site-config.json существуют,
 * в src/index.html сохранены маркеры no-touch (контакты, скрининг, согласия, политика/оферта).
 * Запуск: npm run verify (из корня репозитория).
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const configPath = join(root, "src", "site-config.json");

function fail(msg) {
  console.error(`[verify-pages] ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[verify-pages] ${msg}`);
}

if (!existsSync(configPath)) {
  fail(`Не найден ${configPath}`);
}

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch (e) {
  fail(`Не удалось разобрать site-config.json: ${e.message}`);
}

const contentRoot = config.contentRoot || "src";
const srcDir = join(root, contentRoot);

if (!existsSync(srcDir)) {
  fail(`Каталог контента не найден: ${srcDir}`);
}

const pages = config.pages;
if (!Array.isArray(pages) || pages.length === 0) {
  fail('В site-config.json ожидается непустой массив "pages"');
}

const seen = new Set();
for (const p of pages) {
  if (!p.path) fail(`Запись без path: ${JSON.stringify(p)}`);
  if (seen.has(p.path)) fail(`Дубликат path: ${p.path}`);
  seen.add(p.path);

  const abs = join(srcDir, p.path);
  if (!existsSync(abs)) {
    fail(`Нет файла страницы: ${join(contentRoot, p.path)}`);
  }

  const raw = readFileSync(abs, "utf8");
  if (!/<!doctype html>/i.test(raw)) {
    fail(`Файл не похож на HTML-документ: ${p.path}`);
  }
}

const indexPath = join(srcDir, "index.html");
const indexHtml = readFileSync(indexPath, "utf8");

const markers = config.noTouchMarkers?.indexHtmlMustContain;
if (!Array.isArray(markers) || markers.length === 0) {
  fail('В site-config.json ожидается noTouchMarkers.indexHtmlMustContain (массив строк)');
}

for (const fragment of markers) {
  if (!indexHtml.includes(fragment)) {
    fail(`В src/index.html не найден обязательный фрагмент (no-touch / целостность): ${JSON.stringify(fragment)}`);
  }
}

ok(`Проверено страниц: ${pages.length}`);
ok("Маркеры главной (no-touch / целостность) на месте");
process.exit(0);
