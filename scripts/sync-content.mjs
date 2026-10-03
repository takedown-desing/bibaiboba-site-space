// Копирует черновики контента из пайплайна (drafts/content/*.md) в src/content/pages/.
// Источник правды текстов — пайплайн; в репозитории сайта лежит копия на момент сборки.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';

const SRC = process.env.CONTENT_SRC || path.resolve('../../drafts/content');
const DST = path.resolve('src/content/pages');
if (!fs.existsSync(SRC)) { console.log(`источник ${SRC} не найден — используем уже скопированные файлы`); process.exit(0); }
fs.mkdirSync(DST, { recursive: true });
let ok = 0, bad = [];
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(SRC, f), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) { bad.push(`${f}: нет YAML-шапки`); continue; }
  try {
    const d = yaml.load(m[1]);
    for (const k of ['url', 'slug', 'type', 'title', 'description', 'h1']) if (!d[k]) throw new Error(`нет поля ${k}`);
  } catch (e) { bad.push(`${f}: ${e.message}`); continue; }
  // Типографика: числовые диапазоны через короткое тире («31–62»), только в теле, даты ISO не трогаем.
  const enDash = (s) => s.replace(/(^|[^\d\-/.])(\d{1,3})-(\d{1,3})(?=[^\d\-/]|$)/gm, '$1$2–$3');
  const parts = raw.replace(/\r\n/g, '\n').match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  fs.writeFileSync(path.join(DST, f), parts ? enDash(parts[1]) + enDash(parts[2]) : raw);
  ok++;
}
console.log(`скопировано ${ok} файлов`);
if (bad.length) { console.log('пропущены:\n  ' + bad.join('\n  ')); }
