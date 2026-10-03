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

// Меню шапки: разделы с выпадающими подразделами (общая структура для вариантов Light и Space).
export const NAV = [
  { label: 'SEO', short: 'Поиск', href: '/seo/', items: [
    ['/seo/', 'SEO-продвижение сайта'], ['/seo/optimizaciya/', 'SEO-оптимизация'], ['/seo/yandex/', 'Продвижение в Яндексе'],
    ['/seo/google/', 'Продвижение в Google'], ['/seo/internet-magazin/', 'Интернет-магазин'], ['/seo/sajt-uslug/', 'Сайт услуг'],
    ['/seo/regiony/', 'Продвижение в регионах'], ['/seo/novyj-sajt/', 'Новый сайт'], ['/seo-specialist/', 'Частный SEO-специалист'],
    ['/kontent-dlya-sajta/', 'SEO-тексты и контент'],
  ] },
  { label: 'Нейросети', short: 'Нейросети', href: '/geo/', items: [
    ['/geo/', 'GEO-оптимизация'], ['/geo/prodvizhenie-v-nejrosetyah/', 'Продвижение в нейросетях'], ['/geo/audit/', 'Аудит AI-готовности'],
  ] },
  { label: 'Сайты', short: 'Сайты', href: '/sozdanie-sajtov/', items: [
    ['/sozdanie-sajtov/', 'Создание сайта под ключ'], ['/sozdanie-sajtov/lending/', 'Лендинг'], ['/sozdanie-sajtov/sajt-vizitka/', 'Сайт-визитка'],
    ['/sozdanie-sajtov/korporativnyj-sajt/', 'Корпоративный сайт'], ['/sozdanie-sajtov/dlya-malogo-biznesa/', 'Сайт для малого бизнеса'],
    ['/sozdanie-sajtov/s-prodvizheniem/', 'Сайт с продвижением'], ['/sozdanie-sajtov/na-nejrosetyah/', 'Сайт на нейросетях'],
    ['/prototip-sajta/', 'Прототип сайта'], ['/redizajn-sajta/', 'Редизайн сайта'], ['/dorabotka-sajta/', 'Доработка сайта'],
    ['/podderzhka-sajta/', 'Поддержка сайта'],
  ] },
  { label: 'Авито', short: 'Авито', href: '/avitolog/', items: [
    ['/avitolog/', 'Авитолог под ключ'], ['/prodvizhenie-na-avito/', 'Продвижение на Авито'], ['/avito-konsultaciya/', 'Консультация авитолога'],
    ['/kejsy/', 'Кейсы Авито'],
  ] },
  { label: 'Аудит', short: 'Аудит', href: '/audit-sajta/', items: [
    ['/audit-sajta/', 'SEO-аудит сайта'], ['/audit-sajta/tehnicheskij/', 'Технический аудит'], ['/audit-sajta/yuzabiliti/', 'Юзабилити-аудит'],
    ['/geo/audit/', 'Аудит AI-готовности'], ['/audit-besplatno/', 'Бесплатный экспресс-аудит'],
  ] },
  { label: 'Кейсы', short: 'Кейсы', href: '/kejsy/', cases: true, items: [['/kejsy/', 'Все кейсы']] },
  { label: 'О нас', short: 'О нас', href: '/o-nas/', items: [
    ['/o-nas/', 'Об агентстве'], ['/o-nas/aleksey-borovikov/', 'Алексей Боровиков'], ['/o-nas/valentin-baranov/', 'Валентин Баранов'],
    ['/kontakty/', 'Контакты'], ['/brif/', 'Бриф на проект'],
  ] },
];
