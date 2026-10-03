export const SITE = {
  name: 'Биба и Боба',
  descriptor: 'агентство заявок: поиск, нейросети, Авито',
  origin: 'https://takedown-desing.github.io',
  base: '/bibaiboba-site-space',
  orgId: 'https://bibaiboba.example/#org',
  lang: 'ru',
  preview: true, // превью на GitHub Pages: noindex, пока нет боевого домена
};
export const withBase = (p = '/') => {
  if (!p.startsWith('/')) return p;
  return (SITE.base + p).replace(/\/{2,}/g, '/');
};
export const absUrl = (p = '/') => SITE.origin + withBase(p);
export const AUTHORS = {
  aleksey: { id: 'https://bibaiboba.example/#aleksey', name: 'Алексей Боровиков', role: 'SEO-специалист, поиск, нейросети и сайты', url: '/o-nas/aleksey-borovikov/', initials: 'АБ', since: 'в SEO с 2018 года' },
  valentin: { id: 'https://bibaiboba.example/#valentin', name: 'Валентин Баранов', role: 'Авитолог, продвижение на Авито', url: '/o-nas/valentin-baranov/', initials: 'ВБ', since: 'на Авито с 2018 года' },
};
