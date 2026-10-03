// Подбирает фото с Pexels по слотам images: из шапок контента и кладёт в public/img + src/data/images.json.
// Ключ берётся из PEXELS_API_KEY (локально). В CI не нужен: картинки коммитятся в репозиторий.
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
const KEY = process.env.PEXELS_API_KEY;
const DIR = path.resolve('src/content/pages');
const OUT = path.resolve('public/img');
const MAN = path.resolve('src/data/images.json');
const manifest = fs.existsSync(MAN) ? JSON.parse(fs.readFileSync(MAN, 'utf8')) : {};
fs.mkdirSync(OUT, { recursive: true });
const used = new Set(Object.values(manifest).flatMap((s) => Object.values(s).map((x) => x.pexels_id)));
if (!KEY) { console.log('PEXELS_API_KEY не задан — пропускаю, использую текущий манифест'); process.exit(0); }
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.md'))) {
  const m = fs.readFileSync(path.join(DIR, f), 'utf8').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) continue;
  const d = yaml.load(m[1]);
  for (const im of (d.images || []).filter((x) => ['hero', 'inline-1'].includes(x.slot))) {
    if (manifest[d.slug]?.[im.slot]) continue;
    const q = encodeURIComponent(im.query || 'business laptop');
    const r = await fetch(`https://api.pexels.com/v1/search?query=${q}&orientation=landscape&per_page=15`, { headers: { Authorization: KEY } });
    if (!r.ok) { console.log(`${d.slug}/${im.slot}: pexels ${r.status}`); continue; }
    const js = await r.json();
    const photo = (js.photos || []).find((p) => !used.has(p.id)) || js.photos?.[0];
    if (!photo) { console.log(`${d.slug}/${im.slot}: нет фото по «${im.query}»`); continue; }
    used.add(photo.id);
    const src = `${photo.src.original}?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`;
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    const file = `${d.slug}-${im.slot}.jpg`;
    fs.writeFileSync(path.join(OUT, file), buf);
    (manifest[d.slug] ||= {})[im.slot] = { file: `/img/${file}`, width: 1200, height: 800, alt: im.alt, pexels_id: photo.id, pexels_url: photo.url, photographer: photo.photographer };
    console.log(`${d.slug}/${im.slot}: ${photo.url} (${Math.round(buf.length / 1024)} КБ)`);
    await new Promise((res) => setTimeout(res, 400));
  }
}
fs.writeFileSync(MAN, JSON.stringify(manifest, null, 1));
