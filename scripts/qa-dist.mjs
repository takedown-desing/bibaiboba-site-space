// QA собранного сайта (dist): H1, title/description, FAQ HTML = JSON-LD, битые внутренние ссылки, alt, em-dash, noindex.
import fs from 'node:fs';
import path from 'node:path';
const DIST = path.resolve('dist');
const BASE = (process.env.BASE || fs.readFileSync('src/lib/site.mjs', 'utf8').match(/base:\s*'([^']+)'/)[1]).replace(/\/$/, '');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);
const exists = (url) => {
  let u = url.split('#')[0].split('?')[0];
  if (!u.startsWith(BASE)) return true;
  u = u.slice(BASE.length) || '/';
  const p = path.join(DIST, u);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
let crit = 0, warn = 0;
const rows = [];
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const rel = '/' + path.relative(DIST, f).replace(/index\.html$/, '');
  const issues = [], warns = [];
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) issues.push(`H1 ×${h1}`);
  const title = strip((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!rel.includes('404') && (title.length < 30 || title.length > 70)) warns.push(`title ${title.length}`);
  if (!rel.includes('404') && (desc.length < 110 || desc.length > 175)) warns.push(`description ${desc.length}`);
  if (!/name="robots" content="noindex/.test(h)) issues.push('нет noindex на превью');
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faqLd = ld.flatMap((g) => g['@graph'] || []).find((n) => n['@type'] === 'FAQPage');
  const faqHtml = (h.match(/aria-labelledby="faq-title"[\s\S]*?<\/section>/) || [''])[0];
  const det = [...faqHtml.matchAll(/<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => [strip(m[1]), strip(m[2])]);
  if (faqLd) {
    if (faqLd.mainEntity.length !== det.length) issues.push(`FAQ HTML ${det.length} ≠ JSON-LD ${faqLd.mainEntity.length}`);
    faqLd.mainEntity.forEach((q, i) => { if (det[i] && (det[i][0] !== q.name || det[i][1] !== q.acceptedAnswer.text)) issues.push(`FAQ #${i + 1} расходится`); });
  }
  const pageName = ld.flatMap((g) => g['@graph'] || []).find((n) => /Page$/.test(n['@type']))?.name;
  if (pageName && pageName !== title) issues.push('title ≠ JSON-LD name');
  for (const m of h.matchAll(/<a [^>]*href="([^"]+)"/g)) { const u = m[1]; if (u.startsWith('/') && !exists(u)) issues.push(`битая ссылка ${u}`); }
  for (const m of h.matchAll(/<img [^>]*>/g)) if (!/ alt="/.test(m[0])) issues.push('img без alt');
  const text = strip(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ''));
  if (text.includes('—')) issues.push(`em-dash ×${text.split('—').length - 1}`);
  for (const m of h.matchAll(/<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>/g)) if (!/rel="nofollow noopener"/.test(m[0]) && !/rel="[^"]*\bme\b/.test(m[0]) && !m[1].includes('github.io')) warns.push(`внешняя без nofollow ${m[1].slice(0, 50)}`);
  if (issues.length) crit++;
  if (warns.length) warn++;
  if (issues.length || warns.length) rows.push(`${rel}: ${[...issues.map((x) => 'CRIT ' + x), ...warns.map((x) => 'WARN ' + x)].join('; ')}`);
}
const report = [`# QA-отчёт (${new Date().toISOString().slice(0, 10)})`, '', `Страниц: ${files.length} · с CRITICAL: ${crit} · с WARNING: ${warn}`, '', ...rows.map((r) => `- ${r}`)].join('\n');
fs.writeFileSync('qa-report.md', report + '\n');
console.log(report.split('\n').slice(0, 40).join('\n'));
process.exitCode = crit ? 1 : 0;
