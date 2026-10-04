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
  aleksey: { id: 'https://bibaiboba.example/#aleksey', name: 'Алексей Боровиков', role: 'SEO-специалист, поиск, нейросети и сайты', url: '/o-nas/aleksey-borovikov/', initials: 'АБ', since: 'в SEO с 2018 года', photo: '/img/team/aleksey.webp', photoSm: '/img/team/aleksey-sm.webp' },
  valentin: { id: 'https://bibaiboba.example/#valentin', name: 'Валентин Баранов', role: 'Авитолог, продвижение на Авито', url: '/o-nas/valentin-baranov/', initials: 'ВБ', since: 'на Авито с 2018 года', photo: '/img/team/valentin.webp', photoSm: '/img/team/valentin-sm.webp' },
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

// Разделы кейсов для вкладок-фильтров (поле case.category в шапке кейса).
export const CASE_CATS = [
  ['uslugi', 'Услуги на дому'],
  ['stroyka', 'Стройка и спецтехника'],
  ['shiny', 'Шины и диски'],
  ['tovary', 'Товары и производство'],
];

// Прямые контакты партнёров (без телефонов, решение Алексея 04.10.2026). Иконки: см. CONTACT_ICONS.
export const CONTACTS = {
  aleksey: [
    { kind: 'telegram', label: 'Telegram', handle: '@mrpizdyk', url: 'https://t.me/mrpizdyk' },
    { kind: 'linkedin', label: 'LinkedIn', handle: 'aleksey-borovikov', url: 'https://www.linkedin.com/in/aleksey-borovikov/' },
    { kind: 'github', label: 'GitHub', handle: 'takedown-desing', url: 'https://github.com/takedown-desing' },
    { kind: 'mail', label: 'Почта', handle: 'aleksejborovikov83@gmail.com', url: 'mailto:aleksejborovikov83@gmail.com' },
  ],
  valentin: [
    { kind: 'telegram', label: 'Telegram', handle: '@valentin_avito', url: 'https://t.me/valentin_avito' },
    { kind: 'dzen', label: 'Дзен', handle: 'valentin_avito', url: 'https://dzen.ru/media/valentin_avito' },
  ],
};
export const CONTACT_ICONS = {
  telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 5.5h18v13H3z M3.5 6l8.5 7 8.5-7"/></svg>',
  dzen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 0c.2 6.2 1.4 8.7 4.6 10 1.8.7 4 1 7.4 1.1v1.8c-3.4.1-5.6.4-7.4 1.1-3.2 1.3-4.4 3.8-4.6 10h-.1c-.2-6.2-1.4-8.7-4.6-10C5.5 13.3 3.4 13 0 12.9v-1.8c3.4-.1 5.5-.4 7.3-1.1C10.5 8.7 11.7 6.2 11.9 0z"/></svg>',
};
