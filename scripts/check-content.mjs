// Проверки контракта контента: em-dash, длины title/description, FAQ, ссылки только на существующие страницы.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
const DIR = path.resolve('src/content/pages');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md'));
const pages = new Map();
for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
  const [, fm, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  pages.set(f, { d: yaml.load(fm), body, raw });
}
const urls = new Set([...pages.values()].map((p) => p.d.url));
let crit = 0;
for (const [f, { d, body, raw }] of pages) {
  const issues = [];
  if (raw.includes('—')) issues.push(`em-dash ×${raw.split('—').length - 1}`);
  if (d.title.length < 30 || d.title.length > 70) issues.push(`title ${d.title.length}`);
  if (d.description.length < 110 || d.description.length > 175) issues.push(`description ${d.description.length}`);
  for (const m of body.matchAll(/\]\((\/[^)#\s]*)/g)) if (!urls.has(m[1]) && !m[1].startsWith('/kejsy/avito/')) issues.push(`битая ссылка ${m[1]}`);
  for (const r of d.related || []) if (!urls.has(r.url)) issues.push(`related → ${r.url}`);
  if (/\]\(\/(?:[^)]*\/)?(?:ceny|blog)\//.test(body)) issues.push('ссылка на снятую страницу');
  if (issues.length) { crit += issues.some((i) => i.startsWith('em-dash') || i.startsWith('битая')) ? 1 : 0; console.log(`${f}: ${issues.join('; ')}`); }
}
console.log(`страниц ${pages.size}, с критичными проблемами ${crit}`);
process.exitCode = crit ? 1 : 0;
