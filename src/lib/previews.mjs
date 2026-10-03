// Превью-картинки для карточек (Смотрите также, кейсы, каналы).
// Порядок: своя картинка из previews.json (сгенерирована по промтам, scripts/import-previews.py)
// → фото первого экрана страницы из images.json (Pexels) → нет картинки.
import fs from 'node:fs';
import path from 'node:path';

const read = (f) => { try { return JSON.parse(fs.readFileSync(path.resolve(f), 'utf8')); } catch { return {}; } };
let cache = null;
const data = () => (cache ||= { previews: read('src/data/previews.json'), images: read('src/data/images.json') });

export const slugOf = (url = '/') => url.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';

export function previewFor(url) {
  const s = slugOf(url);
  const { previews, images } = data();
  if (previews[s]) return { ...previews[s], own: true };
  if (images[s]?.hero) return { ...images[s].hero, own: false };
  return null;
}
