// Превью-картинки для карточек (Смотрите также, кейсы, каналы).
// Порядок: своя картинка из previews.json (сгенерирована по промтам, scripts/import-previews.py)
// → фото первого экрана страницы из images.json (Pexels) → нет картинки.
import fs from 'node:fs';
import path from 'node:path';

const read = (f) => { try { return JSON.parse(fs.readFileSync(path.resolve(f), 'utf8')); } catch { return {}; } };
let cache = null;
const data = () => (cache ||= { previews: read('src/data/previews.json'), images: read('src/data/images.json'), art: read('src/data/case-art.json') });

export const slugOf = (url = '/') => url.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';

export function previewFor(url) {
  const s = slugOf(url);
  const { previews, images } = data();
  if (previews[s]) return { ...previews[s], own: true };
  if (images[s]?.hero) return { ...images[s].hero, own: false };
  return null;
}

// Вырезанный предмет на прозрачном фоне для плитки кейса (src/data/case-art.json), иначе null.
export function artFor(url) {
  const s = slugOf(url);
  return data().art[s] || null;
}

// Раскладка плиток мозаики рядами: 8+4, 12, 6+6, 4+8 (из 12 колонок). Одинокая плитка в ряду растягивается на всю ширину.
export function mosaicSizes(n) {
  const rows = [['w8', 'w4'], ['w12'], ['w6', 'w6'], ['w4', 'w8']];
  const out = [];
  let r = 0;
  while (out.length < n) {
    const row = rows[r % rows.length];
    const left = n - out.length;
    if (row.length > left) out.push('w12');
    else out.push(...row);
    r++;
  }
  return out.slice(0, n);
}
