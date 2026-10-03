// Раскладка контента по блокам (общая для вариантов Light и Space; стили у каждого свои).
// Каждый H2 становится отдельной секцией-карточкой с номером. Подразделы H3 внутри секции
// собираются в сетку карточек. Списки «**Заголовок** текст» становятся карточками-фичами.
// Этапы, цифры и таблицы сравнения получают разметку инфографики.
// Фото из images.json (inline-1…N) расставляются по секциям: рядом с текстом или баннером.

const el = (tagName, className, children = [], props = {}) => ({
  type: 'element', tagName,
  properties: { ...(className ? { className: Array.isArray(className) ? className : [className] } : {}), ...props },
  children,
});
const txt = (value) => ({ type: 'text', value });
const cls = (n) => (n?.properties?.className || []).map(String);
const hasCls = (n, c) => cls(n).includes(c);
const isWs = (n) => n.type === 'text' && !n.value.trim();
const isEl = (n, tag) => n?.type === 'element' && (!tag || n.tagName === tag);
const textOf = (n) => (n.type === 'text' ? n.value : (n.children || []).map(textOf).join(''));
const pad = (i) => String(i).padStart(2, '0');

// «широкие» блоки: не кладём их внутрь карточек подразделов и рядом с фото
const isWide = (n) => {
  if (n.type === 'raw') return /case-grid/.test(n.value || '');
  if (!isEl(n)) return false;
  return ['ig', 'blk-cta', 'blk-practice', 'table-wrap', 'case-grid', 'blk-note'].some((c) => hasCls(n, c)) || n.tagName === 'table' || n.tagName === 'figure';
};

// Этапы: <li> → номер + заголовок (первый <strong>) + текст
function shapeSteps(node) {
  const ol = node.children.find((c) => isEl(c, 'ol') || isEl(c, 'ul'));
  if (!ol) return;
  const items = ol.children.filter((c) => isEl(c, 'li'));
  ol.properties.className = ['steps-list'];
  ol.properties.dataCount = String(items.length);
  items.forEach((li, i) => {
    let inl = li.children.filter((c) => !isWs(c));
    if (inl.length && inl.every((c) => isEl(c, 'p'))) inl = inl.flatMap((p, k) => (k ? [txt(' '), ...p.children] : p.children));
    const first = inl.findIndex((c) => !isWs(c));
    let title = null;
    let rest = inl;
    if (first >= 0 && isEl(inl[first], 'strong')) { title = inl[first]; rest = inl.slice(first + 1); }
    if (rest.length && rest[0].type === 'text') rest[0] = txt(rest[0].value.replace(/^[\s.:–-]+/, ''));
    const kids = [el('span', 'step-num', [txt(pad(i + 1))])];
    if (title) kids.push(el('p', 'step-title', [txt(textOf(title).replace(/[.:]\s*$/, ''))]));
    if (rest.some((c) => textOf(c).trim())) kids.push(el('p', 'step-text', rest));
    li.properties = { className: ['step'] };
    li.children = kids;
  });
}

// Цифры: <li><strong>число</strong> подпись</li> → значение + подпись
function shapeStats(node) {
  const ul = node.children.find((c) => isEl(c, 'ul') || isEl(c, 'ol'));
  if (!ul) return;
  const items = ul.children.filter((c) => isEl(c, 'li'));
  ul.properties.className = ['stats-list'];
  ul.properties.dataCount = String(items.length);
  for (const li of items) {
    let inl = li.children.filter((c) => !isWs(c));
    if (inl.length === 1 && isEl(inl[0], 'p')) inl = inl[0].children;
    const i = inl.findIndex((c) => isEl(c, 'strong'));
    if (i < 0) continue;
    const rest = inl.slice(i + 1);
    if (rest.length && rest[0].type === 'text') rest[0] = txt(rest[0].value.replace(/^[\s:–-]+/, ''));
    li.properties = { className: ['stat'] };
    li.children = [el('span', 'stat-value', [txt(textOf(inl[i]))]), el('span', 'stat-label', rest)];
  }
}

// Таблицы: подписи колонок в ячейки, чтобы на телефоне строка стала карточкой
function labelTable(table) {
  const head = [];
  const visit = (n, fn) => { fn(n); (n.children || []).forEach((c) => visit(c, fn)); };
  visit(table, (n) => { if (isEl(n, 'th')) head.push(textOf(n).trim()); });
  if (!head.length) return;
  visit(table, (n) => {
    if (!isEl(n, 'tr')) return;
    n.children.filter((c) => isEl(c, 'td')).forEach((td, i) => { td.properties = { ...td.properties, dataLabel: head[i] || '' }; });
  });
  table.properties = { ...table.properties, className: [...cls(table), 'cmp-table'] };
}

// Список, где каждый пункт начинается с жирного заголовка → карточки
function maybeFeatureList(n) {
  if (!(isEl(n, 'ul') || isEl(n, 'ol'))) return false;
  const items = n.children.filter((c) => isEl(c, 'li'));
  if (items.length < 3) return false;
  const startsStrong = (li) => {
    const k = li.children.filter((c) => !isWs(c));
    const f = k[0] && isEl(k[0], 'p') ? k[0].children.filter((c) => !isWs(c))[0] : k[0];
    return f && isEl(f, 'strong');
  };
  if (!items.every(startsStrong)) return false;
  n.properties = { ...n.properties, className: ['feat-list'], dataCount: String(items.length) };
  return true;
}

function groupSubsections(nodes) {
  const h3n = nodes.filter((n) => isEl(n, 'h3')).length;
  if (h3n < 2) return { out: nodes, grid: false };
  const out = [];
  let grid = null;
  let card = null;
  const flush = () => { if (grid) { grid.properties.dataCount = String(grid.children.length); out.push(grid); } grid = null; card = null; };
  for (const n of nodes) {
    if (isEl(n, 'h3')) {
      grid ||= el('div', 'sub-grid');
      card = el('div', 'sub-card', [n]);
      grid.children.push(card);
    } else if (isWide(n)) {
      flush();
      out.push(n);
    } else if (card) {
      if (!isWs(n)) card.children.push(n);
    } else {
      out.push(n);
    }
  }
  flush();
  return { out, grid: true };
}

const figure = (im, base, variant) => el('figure', ['sec-fig', variant], [
  el('img', null, [], { src: (base + im.file).replace(/\/{2,}/g, '/'), alt: im.alt || '', width: im.width || 1200, height: im.height || 800, loading: 'lazy', decoding: 'async' }),
]);

export default function rehypeLayout(options = {}) {
  const base = options.base || '';
  const images = options.images || {};
  return (tree, file) => {
    const slug = file?.data?.astro?.frontmatter?.slug;
    const kids = tree.children;
    if (!kids.some((n) => isEl(n, 'h2'))) return;

    // инфографика и таблицы
    const walk = (n, inBlock = false) => {
      let block = inBlock;
      if (isEl(n)) {
        if (hasCls(n, 'ig-steps')) shapeSteps(n);
        if (hasCls(n, 'ig-stats')) shapeStats(n);
        if (n.tagName === 'table') labelTable(n);
        if (hasCls(n, 'blk-practice') || hasCls(n, 'blk-cta') || hasCls(n, 'ig')) block = true;
        else if (!block) maybeFeatureList(n);
      }
      (n.children || []).forEach((c) => walk(c, block));
    };
    kids.forEach((n) => walk(n));

    // нарезка по H2
    const chunks = [];
    let cur = { h2: null, body: [] };
    for (const n of kids) {
      if (isEl(n, 'h2')) { chunks.push(cur); cur = { h2: n, body: [] }; } else cur.body.push(n);
    }
    chunks.push(cur);
    const intro = chunks[0].body.some((n) => !isWs(n)) ? chunks[0] : null;
    const secs = chunks.slice(1).map((c) => ({ ...c, ...groupSubsections(c.body) }));

    // фото: сначала в «простые» секции (без сетки и инфографики), равномерно, начиная со второй
    const pics = Object.keys(images[slug] || {}).filter((k) => /^inline-\d+$/.test(k)).sort().map((k) => images[slug][k]);
    const plain = secs.map((s, i) => ({ i, ok: !s.grid && !s.out.some(isWide) })).filter((x) => x.i > 0);
    const order = [...plain.filter((x) => x.ok), ...plain.filter((x) => !x.ok)].map((x) => x.i);
    const slots = new Map();
    if (pics.length && order.length) {
      const step = secs.length / (pics.length + 1);
      const want = pics.map((_, k) => Math.round(step * (k + 1)));
      const free = [...order];
      want.forEach((w, k) => {
        if (!free.length) return;
        const pick = free.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
        slots.set(pick, pics[k]);
        free.splice(free.indexOf(pick), 1);
      });
    }

    const result = [];
    if (intro) result.push(el('section', ['sec', 'sec-intro'], [el('div', 'sec-body', intro.body)]));
    secs.forEach((s, i) => {
      const head = el('div', 'sec-head', [el('span', 'sec-num', [txt(pad(i + 1))], { ariaHidden: 'true' }), s.h2]);
      const pic = slots.get(i);
      let body;
      if (pic && !s.grid && !s.out.some(isWide)) {
        body = el('div', ['sec-body', 'sec-split'], [el('div', 'sec-main', s.out), figure(pic, base, 'sec-fig-side')]);
      } else {
        const out = [...s.out];
        if (pic) {
          const real = out.map((n, k) => [n, k]).filter(([n]) => !isWs(n));
          const last = real[real.length - 1];
          const at = last && hasCls(last[0], 'blk-cta') ? last[1] : out.length;
          out.splice(at, 0, figure(pic, base, 'sec-fig-wide'));
        }
        body = el('div', 'sec-body', out);
      }
      result.push(el('section', ['sec', s.grid ? 'sec-has-grid' : ''].filter(Boolean), [head, body]));
    });
    tree.children = result;
  };
}
